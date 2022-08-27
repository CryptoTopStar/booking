const Sentry = require('/opt/sentry');
const AwsUtils = require('/opt/awsUtils');
const Notice = require('/opt/noticeEmail');
const SystemNotice = require('/opt/systemEmail');

const env = process.env.ENV;

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
    const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);

    for (let record of event.Records) {
        if (record.eventName === 'INSERT') {
            const userName = record.dynamodb.NewImage.name.S;
            const email = record.dynamodb.NewImage.email.S;
            const title = record.dynamodb.NewImage.title.S;
            const text = record.dynamodb.NewImage.text.S;
            const inquiry = {
                email,
                title,
                text,
            };
            await Notice.inquiry({
                email,
                from: systemAddress,
                userName
            });
            await SystemNotice.inquiry({
                inquiry,
                userName
            });
            console.log(`Successfully received inquiry from : ${email}`);
        }
    }

    context.done(null, 'Successfully processed DynamoDB record'); // SUCCESS with message
});
