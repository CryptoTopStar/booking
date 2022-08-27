const AWS = require('aws-sdk');
const ses = new AWS.SES({
    region: 'ap-northeast-1'
});
const AwsUtils = require('/opt/awsUtils');

const env = process.env.ENV;

module.exports = {
    booking: async ({ email, from, booking }) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const mailFooter = await AwsUtils.getSSMParameter(`/${env}/salon/mail/footer`);

        const template =
            `※このメールはシステムからの自動返信です

${booking.userName} 様

予約を受け付けいたしました。
予約内容はマイページよりご確認ください。

-----------------------------------------------------------
<予約内容>
名前: ${booking.userName}
日時: ${booking.dateText}
メニュー: ${booking.menu.name}
オフ: ${booking.off.name}
お支払い予定金額: ${booking.price}円
ご要望:
${booking.request}

※ クーポンを利用した場合、クーポン適用額を引いた金額がお支払い金額となります。
※ 不明点がある場合、店舗にお問い合わせください。
-----------------------------------------------------------

${mailFooter}`;

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
                    Data: `[${salonName}] ご予約ありがとうございました`,
                    Charset: 'utf-8'
                }
            },
            Source: from,
            Destination: {
                ToAddresses: [
                    email
                ]
            }
        };

        await ses.sendEmail(params).promise();
    },
    modify: async ({ email, from, booking }) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const mailFooter = await AwsUtils.getSSMParameter(`/${env}/salon/mail/footer`);

        const template =
            `※このメールはシステムからの自動返信です

${booking.userName} 様

予約変更を受け付けいたしました。
予約内容はマイページよりご確認ください。

-----------------------------------------------------------
<予約内容>
名前: ${booking.userName}
日時: ${booking.dateText}
メニュー: ${booking.menu.name}
オフ: ${booking.off.name}
お支払い予定金額: ${booking.price}円
ご要望:
${booking.request}

※ クーポンを利用した場合、クーポン適用額を引いた金額がお支払い金額となります。
※ 不明点がある場合、店舗にお問い合わせください。
-----------------------------------------------------------

${mailFooter}`;

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
                    Data: `[${salonName}] 予約を変更しました`,
                    Charset: 'utf-8'
                }
            },
            Source: from,
            Destination: {
                ToAddresses: [
                    email
                ]
            }
        };

        await ses.sendEmail(params).promise();
    },
    cancel: async ({ email, from, booking }) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const mailFooter = await AwsUtils.getSSMParameter(`/${env}/salon/mail/footer`);

        const template =
            `※このメールはシステムからの自動返信です

${booking.userName} 様

予約をキャンセルいたしました。
またのご予約をお待ちしております。

-----------------------------------------------------------
<キャンセル内容>
名前: ${booking.userName}
日時: ${booking.dateText}
メニュー: ${booking.menu.name}
オフ: ${booking.off.name}
-----------------------------------------------------------

${mailFooter}`;

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
                    Data: `[${salonName}] 予約をキャンセルしました`,
                    Charset: 'utf-8'
                }
            },
            Source: from,
            Destination: {
                ToAddresses: [
                    email
                ]
            }
        };

        await ses.sendEmail(params).promise();
    },
    inquiry: async ({ email, from, userName }) => {
        const salonName = await AwsUtils.getSSMParameter(`/${env}/salon/name`);
        const mailFooter = await AwsUtils.getSSMParameter(`/${env}/salon/mail/footer`);

        const template =
            `※このメールはシステムからの自動返信です

${userName} 様

問い合わせを受け付けました。
メールでご連絡致しますので今しばらくお待ちくださいませ。

${mailFooter}`;

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
                    Data: `[${salonName}] お問い合わせいただきありがとうございます`,
                    Charset: 'utf-8'
                }
            },
            Source: from,
            Destination: {
                ToAddresses: [
                    email
                ]
            }
        };

        await ses.sendEmail(params).promise();
    }
};