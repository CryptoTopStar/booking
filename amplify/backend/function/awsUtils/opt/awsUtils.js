const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

// SSM parameter Storeからキー情報を取得する
const getSSMParameter = async (name, inSecret = false) => {
  const value = await ssm
    .getParameter({
      Name: name,
      WithDecryption: inSecret,
    })
    .promise()

  return value.Parameter.Value
}

module.exports = {
  getSSMParameter,
}