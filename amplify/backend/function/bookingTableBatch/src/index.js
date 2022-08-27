
const Sentry = require('/opt/sentry');
const contentful = require('contentful');
const moment = require('moment');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const AwsUtils = require('/opt/awsUtils');

const env = process.env.ENV;

const bucketMapping = {
    dev: 'table202236-dev',
    prod: 'table202359-prod'
};
const bucketName = bucketMapping[env];
const fileName = 'public/0.min.json';

const getDate = items => items.map(item => item.fields.date);

exports.handler = Sentry.AWSLambda.wrapHandler(async _ => {
    const space = await AwsUtils.getSSMParameter(`/${env}/contentful/spaceId`);
    const accessToken = await AwsUtils.getSSMParameter(`/${env}/contentful/token`, true);
    const contentfulClient = contentful.createClient({
        space,
        accessToken
    });

    console.log('booking table batch start! day = %s', moment().format('YYYYMMDD'));
    const thisYears = await contentfulClient.getEntries({
        'fields.year': moment().format('YYYY'), // this years
        'content_type': 'holiday'
    });
    const nextYears = await contentfulClient.getEntries({
        'fields.year': moment().add(1, 'years').format('YYYY'), // next years
        'content_type': 'holiday'
    });
    const holidays = [...getDate(thisYears.items), ...getDate(nextYears.items)].sort();
    console.log(holidays);

    let getParams = { Bucket: bucketName, Key: fileName };
    let response = await s3.getObject(getParams).promise();
    const beforeTable = JSON.parse(response.Body.toString());
    const dateOfExistence = beforeTable.map(list => moment(list.day, 'YYYYMMDD').format('YYYYMMDD'));

    // get daily template
    const templates = await Promise.all([...Array(7).keys()].map(async day => {
        const response = await s3.getObject({ Bucket: bucketName, Key: `day/${day}.json` }).promise();
        return JSON.parse(response.Body.toString());
    }));

    // 40 day later schedule
    const scheduleUpto40DaysLater =
        [...Array(Number(process.env.LENGTH)).keys()]
            .map(i => moment().add(i, 'days').format('YYYYMMDD'))
            .filter(date => !dateOfExistence.includes(date))
            .map(date => {
                const day = moment(date, 'YYYYMMDD').day();
                let template = { ...templates[day] };
                template['day'] = date;
                return template;
            });
    const updated = [...beforeTable.filter(list => moment(list.day, 'YYYYMMDD').isSameOrAfter(moment().add(-1, 'days'))), ...scheduleUpto40DaysLater];

    // set a holiday
    const holidayUpdated =
        updated
            .map(schedule => {
                if (holidays.includes(schedule.day)) {
                    schedule.status = schedule.status.map(value => ({
                        ...value,
                        "value": "-"
                    }));
                }
                return schedule;
            });

    const sorted = holidayUpdated.sort((a, b) => Number(a.day) - Number(b.day));
    const putParams = { Bucket: bucketName, Key: fileName, ContentType: "application/json", Body: JSON.stringify(sorted) };
    const results = await s3.putObject(putParams).promise();

    console.log('put results', results);
    console.log('booking table batch success!');
});
