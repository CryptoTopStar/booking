# Contentful Gatsby Booking App

[![Netlify Status](https://api.netlify.com/api/v1/badges/a6b5334c-83ba-46de-b72e-b19527239110/deploy-status)](https://app.netlify.com/sites/festive-swartz-405bdc/deploys)

Create a [Gatsby](http://gatsbyjs.com/) booking app powered by [AWS Amplify](https://aws.amazon.com/amplify/). 

![The index page of the booking app](https://thirosue.github.io/hosting-image/booking/screenshot.png "The index page of the booking app")

Static sites are scalable, secure and have very little required maintenance. They come with a drawback though. Not everybody feels good editing files, building a project and uploading it somewhere. This is where Contentful comes into play.

With Contentful and Gatsby you can connect your favorite static site generator with an API that provides an easy to use interface for people writing content and automate the publishing using services like [Travis CI](https://travis-ci.org/) or [Netlify](https://www.netlify.com/) or [AWS Amplify](https://aws.amazon.com/amplify/) .

## Demo Page

* [https://festive-swartz-405bdc.netlify.app](https://festive-swartz-405bdc.netlify.app)

* demo user

| name | password   | 
| :----| :----------|
| demo | Password1? |

## Features

- booking management
- inquiry management
- corporate site management

## Component

### PlatForm

- [AWS Amplify](https://aws.amazon.com/amplify/)

### FlameWork

- [React](https://reactjs.org/)
- [Gatsby](http://gatsbyjs.com/)
- [Material-UI](https://material-ui.com/)
- [React Hook Form](https://react-hook-form.com/)

### Access Control

- [Amazon Cognito](https://aws.amazon.com/cognito/)

### Storage

#### Master Data

- [Contentful](https://www.contentful.com)

#### Transaction Data

- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)

#### Other

- [Amazon S3](https://aws.amazon.com/s3/)

### Api

- [Amazon API Gateway](https://aws.amazon.com/api-gateway/)
- [AWS AppSync](https://aws.amazon.com/appsync/)

### BackEnd

- [AWS Lambda](https://aws.amazon.com/lambda/)

### Calender App

- Google Calender

### Error Tracking

- [Sentry](https://sentry.io/welcome/)

## Getting started

| type | required | 
| :------| :-----|
| Contents Settings|true|
| FrontEnd Settings|true|
| BackEnd Settings|optional|

* demo user

| name | password   | 
| :----| :----------|
| demo | Password1? |

### Contents Settings

#### Contentful Account Create & Create Personal Access Tokens

See [export / import with Contentful](https://qiita.com/takeshi_hirosue/items/f4539a87a9e2aab382ac#1-%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E4%BD%9C%E6%88%90-personal-access-tokens).

#### Locale Settings

Change the default locale to Japanese

See [Change the default locale to Japanese](https://qiita.com/takeshi_hirosue/items/a30bbd0053cc8fdf5272).

See [Localization with Contentful](https://www.contentful.com/developers/docs/tutorials/general/setting-locales/).

#### Create configuration file

See [export / import with Contentful](https://qiita.com/takeshi_hirosue/items/f4539a87a9e2aab382ac#2%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E4%BD%9C%E6%88%90).

#### Contentful import

```
$ cd contentful-data
$ npx contentful-cli login --management-token xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
$ npx contentful-cli space import --config example-config.json
```

See [export / import with Contentful](https://qiita.com/takeshi_hirosue/items/f4539a87a9e2aab382ac).

See [Importing and exporting content with the Contentful CLI](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/).

### FrontEnd Settings

#### Install the dependencies

```
$ yarn install
```

#### configuration file setup

```bash
$ yarn setup
```

```bash
$ yarn setup
yarn run v1.22.4
$ node ./bin/setup.js
? Your Contentful Space ID XXXXXXXXXXXXXXXX
? Your Contentful Content Delivery API access token XXXXXXXXXXXXXXXXXXXXXXXXXXX
Writing config file...
Config file /path/to/directory/booking/.env.development written
Config file /path/to/directory/booking/.env.production written
All set! You can now run yarn develop to see it in action.
✨  Done in 9.03s.
```

#### Start the app in development mode

```
$ yarn develop
```

Run the project locally with live reload in development mode.

### BackEnd Settings (* optional)

* AWS account required

#### init settings

Amplify init settings.

See [AWS Amplify CLIの使い方〜インストールから初期セットアップまで〜](https://qiita.com/Junpei_Takagi/items/f2bc567761880471fd54).

#### create required parameter

Create the ssm parameters used in CloudFormation.

[![Launch Stack](https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png)](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=booking-app-parameters&templateURL=https://sample-cloudformation-template-67345298.s3-ap-northeast-1.amazonaws.com/parameter.yaml)

* parameter list

| name | type |description|
| :---------------------------------------| :-----|:-------------------------------|
| `/${environments(ex: dev)}/contentful/spaceId`|String|Contentful Space ID|
| `/${environments(ex: dev)}/contentful/token`|SecureString|Contentful Content Delivery API - access token|
| `/${environments(ex: dev)}/googleapis/calendar/credentials`|SecureString|Google Calender Credentials|
| `/${environments(ex: dev)}/googleapis/calendar/token`|SecureString|Google Calender API token|
| `/${environments(ex: dev)}/salon/mail/footer`|String|mail footer|
| `/${environments(ex: dev)}/salon/name`|String|salon name|
| `/${environments(ex: dev)}/sentry/dsn`|String|Sentry DSN|
| `/${environments(ex: dev)}/system/email`|String|salon owner's email address|

These ssm parameters are used by AWS Lambda.

Change the parameter to secure if necessary.

#### create resource

```bash
$ amplify push
```

#### destory :boom:

```bash
$ amplify delete
```

## Deploy to Netlify

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/Thirosue/booking">
  <img src="https://www.netlify.com/img/deploy/button.svg" title="Deploy to Netlify">
</a>

## References

* Gatsby

### Webサイト高速化のための　静的サイトジェネレーター活用入門

https://github.com/ebisucom/gatsbyjs-book
