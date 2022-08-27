const Sentry = require('/opt/sentry');
const Calendar = require('/opt/googleCalender');
const AwsUtils = require('/opt/awsUtils');
const moment = require('moment-timezone');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const env = process.env.ENV;
const timeZone = 'Asia/Tokyo';
const getTime = time => moment(time).tz(timeZone);

const bucketMapping = {
  dev: 'table202236-dev',
  prod: 'table202359-prod'
};
const bucketName = bucketMapping[process.env.ENV];
const fileName = 'public/0.min.json';

// eslint-disable-next-line
exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  for (let record of event.Records) {
    const eventName = record.eventName;
    console.log('EventId:', record.eventID);
    console.log('EventName:', eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (eventName !== 'INSERT' && eventName !== 'REMOVE') break;
    const image = eventName === 'INSERT' ? record.dynamodb.NewImage : record.dynamodb.OldImage;
    const { day, start, cols, nailistId, facilityId } = getAttributes(image);
    console.log('day: %s, start: %d, cols: %d, nailist: %d, facility: %d', day, start, cols, nailistId, facilityId);

    const { from, to } = calcFromTo(start, cols);
    console.log('from: %s, to: %s', from, to);

    // update book status
    const value = eventName === 'INSERT' ? '-' : 'OK';
    const getParams = { Bucket: bucketName, Key: fileName };
    const data = await s3.getObject(getParams).promise();
    const before = JSON.parse(data.Body.toString());
    console.log('befor status: %j', before);
    const updated = before.map(list => {
      if (list.day !== day) return list;
      list.status = list.status.map(at => {
        if (from <= at.time && at.time < to) return { ...at, value }; // From-Toの範囲内の予約を反転させる
        return at;
      });
      return list;
    });

    const putParams = { Bucket: bucketName, Key: fileName, ContentType: "application/json", Body: JSON.stringify(updated) };
    const results = await s3.putObject(putParams).promise();

    console.log('after status: %j', updated);
    console.log('put results', results);

    // sync google calender
    if (eventName === 'INSERT') {
      await insertCalender(image);
    } else if (eventName === 'REMOVE') {
      await Calendar.delete(image.id.S);
    }
  }

  context.done(null, 'Successfully processed DynamoDB record'); // SUCCESS with message
});

const getAttributes = image => {
  return {
    day: image.day.S,
    start: Number(image.time.N),
    cols: Number(image.cols.N),
    nailistId: Number(image.nailistId.N), // TODO Supports multiple Nailist
    facilityId: Number(image.facilityId.N), // TODO Support Facility
  };
};

const calcFromTo = (start, cols) => {
  const beforeBuffer = 30 * 60000; // 事前準備時間
  const treatmentTime = cols * 30 * 60000; // 施術時間
  const afterBuffer = 1 < cols ? 60 * 60000 : 30 * 60000; // 施術後のバッファー　1時間以上の施術の場合、60分を確保する
  const end = start + treatmentTime + afterBuffer; // 確保枠の最終時刻（Long）
  const fromText = getTime(start - beforeBuffer).format('HHmm'); // prepare 30 min before as a secure frame
  const toText = getTime(end).format('HHmm');
  return {
    from: fromText,
    to: toText
  };
};

const insertCalender = async image => {
  console.log('Sync Event captured:');
  console.log(JSON.stringify(image));
  const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);
  const id = image.id.S;
  const dir = image.userName.S;
  const email = image.email.S;
  const menu = image.menu.M.name.S;
  const off = image.off.M.name.S;
  const nailistId = image.nailistId.N; // TODO Supports multiple Nailist
  const cols = Number(image.cols.N);
  const at = moment(image.dateText.S, 'YYYY-MM-DD HH:mm');
  const start = at.format('YYYY-MM-DDTHH:mm:00');
  const end = at.add(cols * 30, 'minutes').format('YYYY-MM-DDTHH:mm:00');

  const event = {
    'summary': `${dir}様 メニュー:${menu} ,オフ:${off}`,
    'description': `id: ${id}, email: ${email}`,
    'start': {
      'dateTime': start,
      'timeZone': 'Asia/Tokyo',
    },
    'end': {
      'dateTime': end,
      'timeZone': 'Asia/Tokyo',
    },
    'attendees': [
      { 'email': systemAddress },
      { 'email': email },
    ],
    'colorId': `${nailistId}`,
    'reminders': {
      'useDefault': false,
      'overrides': [
        { 'method': 'email', 'minutes': 120 },
        { 'method': 'popup', 'minutes': 30 },
      ],
    },
  };

  await Calendar.insert(event, id);
};