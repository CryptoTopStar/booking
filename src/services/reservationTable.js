import awsconfig from '../aws-exports';

const ENDPOINT = process.env.GATSBY_BOOKING_STATUS_ENDPOINT || `https://${awsconfig.aws_user_files_s3_bucket}.s3-ap-northeast-1.amazonaws.com`

// 予約表 を取得する
const getAll = async () => {
    const time = new Date().getTime()
    const status = fetch(`${ENDPOINT}/public/0.min.json?_=${time}`, {
        mode: 'cors'
    }).then(response => response.json())
    return status
};

const ReservationTableService = { getAll }

export default ReservationTableService