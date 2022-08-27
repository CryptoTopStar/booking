const Sentry = require("@sentry/serverless");

const env = process.env.ENV;
const dsn = process.env.SentryDSN;

Sentry.AWSLambda.init({
  dsn,
  tracesSampleRate: 1.0,
});

module.exports = Sentry;