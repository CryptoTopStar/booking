const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const Sentry = require('/opt/sentry');

const server = awsServerlessExpress.createServer(app);

exports.handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
});
