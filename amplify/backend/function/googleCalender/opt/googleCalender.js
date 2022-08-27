const AwsUtils = require('/opt/awsUtils');
const { google } = require('googleapis');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;

let tableName = "calenderRelation";
if (env && env !== "NONE") {
  tableName = tableName + '-' + env;
}

const getOAuth2Client = async () => {
  const credentialsText = await AwsUtils.getSSMParameter(`/${env}/googleapis/calendar/credentials`, true);
  const credentials = JSON.parse(credentialsText);

  const tokenText = await AwsUtils.getSSMParameter(`/${env}/googleapis/calendar/token`, true);
  const token = JSON.parse(tokenText);

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

const insertCalender = async (auth, event) => {
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  });

  return response;
}

const deleteCalender = async (auth, eventId) => {
  const calendar = google.calendar({ version: 'v3', auth });

  const response = await calendar.events.delete({
    auth: auth,
    calendarId: 'primary',
    eventId,
  });

  return response;
}

module.exports = {
  insert: async (event, id) => {
    console.log('Create Event captured:');
    console.log(event);

    const oAuth2Client = await getOAuth2Client();

    const response = await insertCalender(oAuth2Client, event);
    console.log('Event created:', response);

    await dynamodb.put({
      TableName: tableName,
      Item: {
        bookingId: id,
        eventId: response.data.id
      }
    }).promise();
  },
  delete: async id => {
    console.log('Delete Event id: %s', id);

    const queryParams = {
      TableName: tableName,
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "bookingId"
      },
      ExpressionAttributeValues: {
        ":id": id
      }
    };
    const results = await dynamodb.query(queryParams).promise();

    if (results.Items.length) {
      const { eventId } = results.Items[0];
      console.log('Delete Google Event id: %s', eventId);

      // remove google calender
      const oAuth2Client = await getOAuth2Client();
      const response = await deleteCalender(oAuth2Client, eventId);
      console.log('Event deleted:', response);

      // remove relation table
      const removeItemParams = {
        TableName: tableName,
        Key: {
          bookingId: id
        }
      }
      await dynamodb.delete(removeItemParams).promise();
    }
  }
};