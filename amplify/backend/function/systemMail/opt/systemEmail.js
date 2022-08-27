const AWS = require('aws-sdk');
const ses = new AWS.SES({
    region: 'ap-northeast-1'
});
const AwsUtils = require('/opt/awsUtils');

const env = process.env.ENV;

module.exports = {
    booking: async (booking) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);

        const template =
            `※このメールはシステムからの自動返信です

担当者 様

予約が入りました。
必要に応じて予約状況を確認して下さい。

-----------------------------------------------------------
<予約内容>
名前: ${booking.userName}
日時: ${booking.dateText}
メニュー: ${booking.menu.name}
オフ: ${booking.off.name}
電話番号: ${booking.tel}
メール: ${booking.email}
お支払い予定金額: ${booking.price}円
ご要望:
${booking.request}
-----------------------------------------------------------`;

        const params = {
            Destination: {},
            Message: {
                Body: {
                    Text: {
                        Data: template,
                        Charset: 'utf-8'
                    }
                },
                Subject: {
                    Data: `[${salonName}] 予約が入りました（${booking.userName} 様）`,
                    Charset: 'utf-8'
                }
            },
            Source: systemAddress,
            Destination: {
                ToAddresses: [
                    systemAddress
                ]
            }
        };

        await ses.sendEmail(params).promise();
    },
    modify: async (booking) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);

        const template =
            `※このメールはシステムからの自動返信です

担当者 様

予約が変更されました。
必要に応じて予約状況を確認して下さい。

-----------------------------------------------------------
<予約内容>
名前: ${booking.userName}
日時: ${booking.dateText}
メニュー: ${booking.menu.name}
オフ: ${booking.off.name}
電話番号: ${booking.tel}
メール: ${booking.email}
お支払い予定金額: ${booking.price}円
ご要望:
${booking.request}
-----------------------------------------------------------`;


        const params = {
            Destination: {},
            Message: {
                Body: {
                    Text: {
                        Data: template,
                        Charset: 'utf-8'
                    }
                },
                Subject: {
                    Data: `[${salonName}] 予約が変更されました（${booking.userName} 様）`,
                    Charset: 'utf-8'
                }
            },
            Source: systemAddress,
            Destination: {
                ToAddresses: [
                    systemAddress
                ]
            }
        };

        await ses.sendEmail(params).promise();
    },
    cancel: async (booking) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);

        const template =
            `※このメールはシステムからの自動返信です

担当者 様

予約がキャンセルされました。
必要に応じて予約状況を確認して下さい。

-----------------------------------------------------------
<キャンセル内容>
名前: ${booking.userName}
日時: ${booking.dateText}
メニュー: ${booking.menu.name}
オフ: ${booking.off.name}
電話番号: ${booking.tel}
メール: ${booking.email}
-----------------------------------------------------------`;


        const params = {
            Destination: {},
            Message: {
                Body: {
                    Text: {
                        Data: template,
                        Charset: 'utf-8'
                    }
                },
                Subject: {
                    Data: `[${salonName}] 予約がキャンセルされました（${booking.userName} 様）`,
                    Charset: 'utf-8'
                }
            },
            Source: systemAddress,
            Destination: {
                ToAddresses: [
                    systemAddress
                ]
            }
        };

        await ses.sendEmail(params).promise();
    },
    inquiry: async ({ inquiry, userName }) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const systemAddress = await AwsUtils.getSSMParameter(`/${env}/system/email`);

        const template =
            `※このメールはシステムからの自動返信です

問い合わせを受け付けました。
問い合わせ内容を確認し、メールで返信して下さい。

<問い合わせ内容>
名前: ${userName} 
メール: ${inquiry.email} 
タイトル: ${inquiry.title} 
内容:
${inquiry.text}`;

        const params = {
            Destination: {},
            Message: {
                Body: {
                    Text: {
                        Data: template,
                        Charset: 'utf-8'
                    }
                },
                Subject: {
                    Data: `[${salonName}] 問い合わせを受け付けました（${userName} 様）`,
                    Charset: 'utf-8'
                }
            },
            Source: systemAddress,
            Destination: {
                ToAddresses: [
                    systemAddress
                ]
            }
        };

        await ses.sendEmail(params).promise();
    }
};