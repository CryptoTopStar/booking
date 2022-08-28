import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import moment from 'moment';
import { head } from 'lodash';
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
import Form from './updateForm'
import Review from './review'
import Submit from "../../atoms/submit"
import BookingService from "../../../services/booking"

const query = graphql`
  query {
    allContentfulMenu(sort: {fields: [order], order: ASC}) {
      edges {
        node {
          contentfulid
          name
          price
          time
          description {
            description
          }
        }
      }
    }
    allContentfulSideMenu(sort: {fields: [order], order: ASC}) {
      edges {
        node {
          contentfulid
          name
          price
          time
          description {
            description
          }
        }
      }
    }
  }
`

const useStyles = makeStyles((theme) => ({
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

const steps = ['Change', 'Review'];

function getStepContent(step, register, setValue, form) {
    switch (step) {
        case 0:
            return <Form register={register} setValue={setValue} form={form} />;
        case 1:
            return <Review form={form} />;
        default:
            throw new Error('Unknown step');
    }
}

const BookingChangeForm = ({ booking, open, handleClose }) => {
    const contentful = useStaticQuery(query)

    React.useEffect(() => {
        setForm(booking)
    }, [booking]);

    const context = React.useContext(GlobalContext);
    const confirm = useConfirm();
    const classes = useStyles();
    const [form, setForm] = React.useState({});

    const [activeStep, setActiveStep] = React.useState(0);

    const { register, setValue, handleSubmit } = useForm();

    const doHandleClose = () => {
        setActiveStep(0);
        handleClose()
    };

    const doReload = () => {
        window.location.reload()
    };


    const handleNext = async data => {
        console.log(activeStep, data, form)

        // 予約変更
        if (activeStep) {
            const date = moment(form.dateText, 'YYYY-MM-DD HH:mm')
            const body = {
                ...form,
                sub: context.state.session.sub,
                day: date.format('YYYYMMDD'),
                at: date.format('HHmm'),
                time: date.toDate().getTime(),
                cols: (form.menu?.time + form.off?.time) / 30,
                nailistId: 0, // TODO Supports multiple Nailist
                facilityId: 0, // TODO Support Facility
                salon: process.env.GATSBY_SALON_NAME,
                beforeDay: booking.day,
                beforeTime: booking.time
            }
            context.startProcess()
            const response = await BookingService.update(body)
            context.endProcess()
            if (response.status === 409) {
                confirm({ alert: true, html: true, description: (<>選択した時間に先約があります。予約表を参考に別の時間を選択の上、再度予約変更してください。<br />予約変更できない場合はサロンへ直接へお問い合わせください。<br /></>) })
                    .then(() => doHandleClose())
            }
            console.log('api done', body, response)
        }
        // 予約編集
        else {
            let { tax, dateText, priceTaxExcluded, price, day, time } = booking
            let updated = {}

            if (data.day || data.hour || data.time) {
                let yyyyMMdd = data.day ? moment(data.day).format('YYYYMMDD') : day;
                let hh = data.hour ? data.hour : moment(time).format('HH');
                let mm = data.time ? data.time : moment(time).format('mm');
                dateText = moment(yyyyMMdd + hh + mm, "YYYYMMDDHHmm").format('YYYY-MM-DD HH:mm')
            }
            if (data.menuId) {
                updated.menu = head(contentful.allContentfulMenu.edges.map(menu => menu.node).filter(menu => menu.contentfulid === data.menuId))
            }
            if (data.offId) {
                updated.off = head(contentful.allContentfulSideMenu.edges.map(menu => menu.node).filter(menu => menu.contentfulid === data.offId))
            }
            console.log(data, updated)
            setForm(prevForrmState => ({
                ...prevForrmState,
                ...updated,
                dateText,
                tax,
                priceTaxExcluded,
                priceTaxExcludedText: priceTaxExcluded.toLocaleString('ja-JP', { "style": "currency", "currency": "JPY" }),
                price,
                priceText: price.toLocaleString('ja-JP', { "style": "currency", "currency": "JPY" })
            }))
        }

        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const dialogContext = {
        title: "予約の変更",
        content: (<>
            <Stepper activeStep={activeStep} className={classes.stepper}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            予約を変更しました。
                        </Typography>
                        <Typography variant="subtitle1">
                            サロンでお会いできるのを楽しみにしております。
                        </Typography>
                    </>
                ) : (
                    <>
                        {getStepContent(activeStep, register, setValue, form)}
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
                    </>
                )}
            </>
        </>),
        action: (<>
            {activeStep === steps.length &&
                (<Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" mb="1rem">
                            <Button fullWidth size="large" variant="contained" onClick={doReload} color="primary">
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

export default BookingChangeForm