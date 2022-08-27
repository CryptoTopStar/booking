/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var { v4: uuidv4 } = require('uuid');
const Notice = require('/opt/noticeEmail');
const SystemNotice = require('/opt/systemEmail');
const AwsUtils = require('/opt/awsUtils');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const env = process.env.ENV;
let tableName = "booking";
if (env && env !== "NONE") {
  tableName = tableName + '-' + env;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "day";
const partitionKeyType = "S";
const sortKeyName = "time";
const sortKeyType = "N";
const hasSortKey = sortKeyName !== "";
const path = "/booking";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// UserIndex
const indexPartitionKeyName = "sub";

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(`${path}/${partitionKeyName}${hashKeyPath}`, function (req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [convertUrlType(req.params[partitionKeyName], partitionKeyType)];
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/********************************
 * HTTP Get method for list objects *
 ********************************/
app.get(`${path}/${indexPartitionKeyName}/:sub`, function (req, res) {
  let queryParams = {
    TableName: tableName,
    IndexName: 'CustomerIndex',
    KeyConditionExpression: "#hash = :hash and :start <= #sort",
    ExpressionAttributeNames: {
      "#hash": "sub",
      "#sort": "time",
    },
    ExpressionAttributeValues: {
      ":hash": req.params[indexPartitionKeyName],
      ":start": new Date().getTime()
    }
  };

  console.log(JSON.stringify(req.params))

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/object' + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err.message });
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data);
      }
    }
  });
});

/************************************
* check conflict booking            *
*************************************/
const checkExistPreviousBook = async event => {
  console.log('do checkExistPreviousBook?', event)
  const { day, at, start, end, nailistId, sub, beforeAt } = event;
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#hash = :hash and #sort between :start and :end",
    ExpressionAttributeNames: {
      "#hash": "day",
      "#sort": "time",
    },
    ExpressionAttributeValues: {
      ":hash": day,
      ":start": start,
      ":end": end,
    }
  };
  const response = await dynamodb.query(params).promise();
  console.log('isExistPreviousBook?', response);
  if (!response.Items.length) return false;
  const anotherBookings = response.Items.filter(i => !(i.time === (beforeAt ? beforeAt : at) && i.nailistId === nailistId && i.sub === sub)); // 編集中の予約（新規予約時は予約しようとしている予約／変更時は変更対象の予約）
  const flgs = anotherBookings.map(item => {
    // 事前予約の競合チェック
    if (item.time < at) {
      const treatmentTime = item.cols * 30 * 60000; // 施術時間
      const buffer = 1 < item.cols ? 60 * 60000 : 30 * 60000; // 施術後のバッファー　1時間以上の施術の場合、60分を確保する
      return at - (treatmentTime + buffer) < item.time; // 事前チェック枠（予約時間から事前の予約の施術時間を減算した時間）以降に予約が存在する場合はNG
    }
    // 事後予約の競合チェック
    else {
      return item.time <= end; // 事後チェック枠までに予約が存在する場合はNG
    }
  });
  return flgs.includes(true);
}

/************************************
* HTTP put method for insert object *
*************************************/

app.put(path, async function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  // check previous booking
  const at = Number(req.body.time);
  const cols = Number(req.body.cols);
  const maxTreatmentTime = 6 * 30 * 60000; // 最大施術時間(180H)
  const maxBuffer = 60 * 60000; // 最大バッファー時間(60H)
  const treatmentTime = cols * 30 * 60000; // 施術時間
  const buffer = 1 < cols ? 60 * 60000 : 30 * 60000; // 施術後のバッファー　1時間以上の施術の場合、60分を確保する
  const isExistPreviousBook = await checkExistPreviousBook({
    day: req.body.day,
    at,
    start: at - (maxTreatmentTime + maxBuffer) + 1,
    end: at + treatmentTime + buffer - 1,
    nailistId: Number(req.body.nailistId),
    sub: req.body.sub,
    beforeAt: Number(req.body.beforeTime)
  }); // 予約が競合してないかチェックする
  if (isExistPreviousBook) {
    res.statusCode = 409
    res.json({ error: 'The previous booking was in conflict', url: req.url, body: req.body })
    return
  }

  // remove previous booking
  let removeItemParams = {
    TableName: tableName,
    Key: {
      day: req.body.beforeDay,
      time: req.body.beforeTime
    }
  }
  await dynamodb.delete(removeItemParams).promise();

  let putItemParams = {
    TableName: tableName,
    Item: {
      ...req.body,
      id: uuidv4()
    }
  }
  dynamodb.put(putItemParams, async (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      // notice email
      const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);
      await Notice.modify({
        email: req.body.email,
        from: systemAddress,
        booking: req.body
      });
      await SystemNotice.modify(req.body);

      res.json({ success: 'put call succeed!', url: req.url, data: data })
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, async function (req, res) {

  if (userIdPresent) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  // check previous booking
  const at = Number(req.body.time);
  const cols = Number(req.body.cols);
  const maxTreatmentTime = 6 * 30 * 60000; // 最大施術時間(180H)
  const maxBuffer = 60 * 60000; // 最大バッファー時間(60H)
  const treatmentTime = cols * 30 * 60000; // 施術時間
  const buffer = 1 < cols ? 60 * 60000 : 30 * 60000; // 施術後のバッファー　1時間以上の施術の場合、60分を確保する
  const isExistPreviousBook = await checkExistPreviousBook({
    day: req.body.day,
    at,
    start: at - (maxTreatmentTime + maxBuffer) + 1,
    end: at + treatmentTime + buffer - 1,
    nailistId: Number(req.body.nailistId),
    sub: req.body.sub
  }); // 予約が競合してないかチェックする
  if (isExistPreviousBook) {
    res.statusCode = 409
    res.json({ error: 'The previous booking was in conflict', url: req.url, body: req.body })
    return
  }

  let putItemParams = {
    TableName: tableName,
    Item: {
      ...req.body,
      id: uuidv4()
    }
  }
  dynamodb.put(putItemParams, async (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      // notice email
      const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);
      await Notice.booking({
        email: req.body.email,
        from: systemAddress,
        booking: req.body
      });
      await SystemNotice.booking(req.body);

      res.json({ success: 'post call succeed!', url: req.url, data: data })
    }
  });
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete(path + '/object' + hashKeyPath + sortKeyPath, async function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(req.params[partitionKeyName], partitionKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(req.params[sortKeyName], sortKeyType);
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: 'Wrong column type ' + err });
    }
  }

  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: "#hash = :hash and #sort = :sort",
    ExpressionAttributeNames: {
      "#hash": "day",
      "#sort": "time",
    },
    ExpressionAttributeValues: {
      ":hash": params[partitionKeyName],
      ":sort": params[sortKeyName]
    }
  };
  const response = await dynamodb.query(queryParams).promise();
  const booking = response.Items[0];

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }
  dynamodb.delete(removeItemParams, async (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      // notice email
      const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);
      await Notice.cancel({
        email: booking.email,
        from: systemAddress,
        booking
      });
      await SystemNotice.cancel(booking);

      res.json({ url: req.url, data: data });
    }
  });
});
app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
