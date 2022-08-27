import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import useBooking from '../../hooks/useBooking'
import useConfirm from '../../hooks/useConfirm'
import GlobalContext from '../../context/global-context'
import ChangeForm from '../../components/pages/booking/change';
import Progress from "../../components/Progress";

const useStyles = makeStyles({
    root: {},
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

const Index = () => {
    const classes = useStyles();
    const context = React.useContext(GlobalContext);
    const confirm = useConfirm();
    const { bookings, cancel } = useBooking(context.state.session.sub);
    const [selected, setSelected] = React.useState({});

    React.useEffect(() => {
        console.log(context.state.session.sub, bookings)
    }, [context.state.session.sub, bookings]);

    const handleCancel = booking => {
        confirm({ description: '本当にキャンセルしますか？' })
            .then(async () => {
                await cancel(booking.day, booking.time)
                confirm({ alert: true, description: 'キャンセルが正常終了しました' })
                    .then(() => window.location.reload())
            })
            .catch(() => {/* キャンセルを踏みとどまりました */ })
    };

    // for update
    const [open, setOpen] = React.useState(false);

    const handleOpen = booking => {
        setSelected(booking)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Progress processing={bookings === null} />
            <ChangeForm booking={selected} open={open} handleClose={handleClose} />
            {bookings !== null && bookings.length !== 0 && (
                <>
                    <h3 style={{ margin: '10px 0', textAlign: "center" }}>予約状況</h3>
                    <Grid container>
                        {bookings.map((booking) =>
                        (<Grid key={booking.time} item xs={12} sm={6} md={6}>
                            <Card className={classes.root} >
                                <CardContent>
                                    <Typography variant="subtitle1">
                                        予約日時: {booking.dateText}
                                    </Typography>
                                    <Box mb="0.25rem" />
                                    <Typography variant="subtitle1">
                                        メニュー: {booking.menu?.name}（{booking.off?.name}）
                                        </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button onClick={() => handleCancel(booking)} size="small">キャンセル</Button>
                                    <Button onClick={() => handleOpen(booking)} size="small" color="primary">
                                        変更する
                                    </Button>
                                </CardActions>
                            </Card>
                            <Box mb="1rem" />
                        </Grid>)
                        )}
                    </Grid>
                </>)}
            {bookings !== null && bookings.length === 0 && (<>予約なし</>)}
        </>)
}

export default Index