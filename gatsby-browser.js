import React from "react"
import Amplify from 'aws-amplify';
import awsconfig from './src/aws-exports';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import Layout from "./src/templates/layout/top";
import Mypage from "./src/templates/layout/mypage";

// Amplify Settings
Amplify.configure(awsconfig);

if (!!Number(process.env.GATSBY_TRACE)) {
  console.log('sentry enabled.')
  // Sentry Settings
  Sentry.init({
    dsn: process.env.GATSBY_SENTRY_DSN,
    integrations: [
      new Integrations.BrowserTracing(),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: Number(process.env.GATSBY_TRACE),
  });
} else {
  console.log('sentry disable....')
}

// Logs when the client route changes
export const onRouteUpdate = ({ location, prevLocation }) => {
  console.log("new pathname", location.pathname)
  console.log("old pathname", prevLocation ? prevLocation.pathname : null)
}

// Wraps every page in a component
export const wrapPageElement = ({ element, props }) => {
  if (props.location.pathname.startsWith('/mypage'))
    return <Mypage {...props}>{element}</Mypage>;
  else
    return <Layout {...props}>{element}</Layout>;
};