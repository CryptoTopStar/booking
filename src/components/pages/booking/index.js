import React from 'react';
import MediaQuery from 'react-responsive'
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FullScreenDialog from "../../../templates/dialog/fullscreen"
import GlobalContext from '../../../context/global-context'
import { useForm } from "react-hook-form"
import useConfirm from '../../../hooks/useConfirm'
import SignInForm from '../auth/signin'
import Menu from './menu';
import Status from './status';
import Form from './form'
import Review from './review'
import AuthService from "../../../services/auth"
import BookingService from "../../../services/booking";
import Submit from "../../atoms/submit";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    stepper: {
        padding: theme.spacing(1, 0, 3),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
}));

const steps = ['Menu', 'Date', 'Details', 'Review'];

function getStepContent(handleNext, step, register, errors, form) {
    switch (step) {
        case 0:
            return <Menu handleNext={handleNext} />;
        case 1:
            return <Status handleNext={handleNext} form={form} />;
        case 2:
            return <Form register={register} errors={errors} form={form} />;
        case 3:
            return <Review form={form} />;
        default:
            throw new Error('Unknown step');
    }
}

/*****************************************
 * Booking Confirm Settings *
 *****************************************/

async function confirmMenu(data, _, confirm) {
    let stopFlg = false
    const ids = [data.menu?.contentfulid, data.off?.contentfulid]
    if (ids.filter(id => id && id.indexOf('hand') !== -1).length && ids.filter(id => id && id.indexOf('foot') !== -1).length) {
        await confirm({ html: true, description: (<><strong>ハンドメニュー</strong>と<strong>フットメニュー</strong>を選択しています。<br />間違いないですか？</>) })
            .catch(() => stopFlg = true);
    }
    return stopFlg
}

const confirmMapping = {
    0: confirmMenu,
}

/*****************************************
 * Booking Submit Settings *
 *****************************************/

async function getUser(_, confirm, handleClose) {
    return new Promise(async resolve => {
        console.log('get user')
        await AuthService.getUser()
            .then(user => {
                console.log(user)
                resolve({
                    user,
                    userName: user.attributes.nickname,
                    tel: !!user.attributes.phone_number ? user.attributes.phone_number.replace('+81', '') : null,
                    email: user.attributes.email,
                })
            })
            .catch(() => {
                confirm({ alert: true, description: 'セッションがタイムアウトしました。再度ログインしてください。' })
                    .then(() => {
                        handleClose()
                        window.location.reload()
                    })
                resolve(false)
            })

    })
}

async function syncUser(data) {
    return new Promise(async resolve => {
        console.log('do sync user')
        const phoneUpdate = !data.user?.attributes?.phone_number || data.user.attributes.phone_number !== `+81${data.tel}`
        const nameUpdate = !data.user?.attributes?.nickname || data.user.attributes.nickname !== data.userName
        if (phoneUpdate || nameUpdate) {
            const response = await AuthService.updateAttributes(
                data.user,
                {
                    nickname: data.userName,
                    phone_number: `+81${data.tel}`,
                },
            )
            console.log(response)
        }
        resolve(true)
    })
}

async function book(data, confirm, handleClose) {
    return new Promise(async resolve => {
        const body = {
            ...data,
            sub: data.user.attributes.sub,
            day: moment(data.dateText, 'YYYY-MM-DD HH:mm').format('YYYYMMDD'),
            time: moment(data.dateText, 'YYYY-MM-DD HH:mm').toDate().getTime(),
            cols: (data.menu?.time + data.off?.time) / 30,
            nailistId: 0, // TODO Supports multiple Nailist
            facilityId: 0, // TODO Support Facility
            salon: process.env.GATSBY_SALON_NAME,
        }
        const response = await BookingService.create(body)
        if (response.status === 409) {
            confirm({ alert: true, html: true, description: (<>選択した時間に先約があります。別の時間を選択の上、再度予約してください。<br />予約できない場合はサロンへ直接へお問い合わせください。<br /></>) })
                .then(() => handleClose())
            resolve(false)
        }
        console.log('api done', body, response)
        resolve(true)
    })
}

const submitMapping = {
    1: getUser,
    99: syncUser,
    3: book,
}

const Index = ({ open, handleClose }) => {
    const context = React.useContext(GlobalContext);
    const confirm = useConfirm();
    const classes = useStyles();
    const [form, setForm] = React.useState({});

    const [activeStep, setActiveStep] = React.useState(0);

    const { register, handleSubmit, errors, clearErrors } = useForm();

    const doHandleClose = () => {
        clearErrors()
        setActiveStep(0);
        handleClose()
    };

    const handleNext = async data => {
        console.log(data)

        const confirmAction = confirmMapping[activeStep];
        if (!!confirmAction) {
            const stop = await confirmAction(data, form, confirm)
            if (stop) return false
        }

        let info = {}
        const submitAction = submitMapping[activeStep];
        if (!!submitAction) {
            context.startProcess()
            const results = await submitAction({ ...form, ...data }, confirm, doHandleClose)
                .catch(() => doHandleClose())
                .finally(() => context.endProcess())
            if (!results) return false
            info = { ...results }
        }

        const tax = 1.1
        const dateText = !!data?.date ? moment(data.date + data.at, "YYYYMMDDHHmm").format('YYYY-MM-DD HH:mm') : form?.dateText
        const priceTaxExcluded = (form?.menu?.price ? form?.menu?.price : 0) + (form?.off?.price ? form?.off?.price : 0)
        const price = Math.round(priceTaxExcluded * tax)
        setForm(prevForrmState => ({
            ...prevForrmState,
            ...info,
            ...data,
            dateText,
            tax,
            priceTaxExcluded,
            priceTaxExcludedText: priceTaxExcluded.toLocaleString('ja-JP', { "style": "currency", "currency": "JPY" }),
            price,
            priceText: price.toLocaleString('ja-JP', { "style": "currency", "currency": "JPY" })
        }))
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    // For Sign in
    const [openSignin, setOpenSignin] = React.useState(true);

    const handleCloseSignin = () => {
        setOpenSignin(false)
        handleClose()
    };

    React.useEffect(() => {
        setOpenSignin(true)
    }, [openSignin]);

    const dialogContext = {
        title: "Booking",
        content: (
            <GlobalContext.Consumer>
                {context =>
                (<>
                    {!context.state.signedIn && (
                        <SignInForm open={openSignin} handleClose={handleCloseSignin} />
                    )}
                    {!!context.state.signedIn &&
                        (<>
                            {/* iPhoneX以下 */}
                            <MediaQuery maxDeviceWidth={412}>
                                <Stepper alternativeLabel activeStep={activeStep} className={classes.stepper}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </MediaQuery>
                            {/* iPhoneX Plus以上 */}
                            <MediaQuery minDeviceWidth={413}>
                                <Stepper activeStep={activeStep} className={classes.stepper}>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </MediaQuery>
                            <>
                                {activeStep === steps.length ? (
                                    <>
                                        <Typography variant="h5" gutterBottom>
                                            予約を受け付けました。
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            サロンでお会いできるのを楽しみにしております。
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        {getStepContent(handleNext, activeStep, register, errors, form)}
                                        {1 < activeStep && (
                                            <div className={classes.buttons}>
                                                {activeStep !== 0 && (
                                                    <Button onClick={handleBack} className={classes.button}>
                                                        Back
                                                    </Button>
                                                )}
                                                <Submit
                                                    onClick={handleSubmit(handleNext)}
                                                    className={classes.button}
                                                >
                                                    {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                                                </Submit>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        </>)}
                </>)}
            </GlobalContext.Consumer>
        ),
        action: (<>
            {activeStep === steps.length &&
                (<Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" mb="1rem">
                            <Button fullWidth size="large" variant="contained" onClick={doHandleClose} color="primary">
                                閉じる
                            </Button>
                        </Box>
                    </Grid>
                </Grid>)
            }
        </>)
    };

    return (
        <FullScreenDialog
            open={open}
            handleClose={doHandleClose}
            context={dialogContext}
        />
    );
}

export default Index