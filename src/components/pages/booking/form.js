import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const BookingForm = ({ register, errors, form }) => {

    React.useEffect(() => {
        console.log(form)
    }, [form]);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Booking Detail
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        id="date"
                        name="date"
                        label="Date"
                        value={form.dateText}
                        fullWidth
                        disabled
                    />
                </Grid>
                {!!form.menu?.contentfulid && (
                    <Grid item xs={12} md={12}>
                        <TextField
                            id="menuName"
                            name="menufName"
                            label="Menu"
                            defaultValue={form.menu.name}
                            fullWidth
                            disabled
                        />
                    </Grid>
                )}
                {!!form.off?.contentfulid && (
                    <Grid item xs={12} md={12}>
                        <TextField
                            id="offName"
                            name="offName"
                            label="Off"
                            defaultValue={form.off.name}
                            fullWidth
                            disabled
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="userName"
                        name="userName"
                        label="User name"
                        defaultValue={form.userName}
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.userName)}
                        helperText={errors.userName && "入力してください"}
                        autoComplete="booking-name"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="tel"
                        name="tel"
                        label="Tel"
                        defaultValue={form.tel}
                        fullWidth
                        inputRef={register({
                            required: true,
                            pattern: {
                                value: /^[0-9]{10,11}$/i
                            }
                        })}
                        helperText={errors.tel && "数値のみで入力してください(10-11桁)"}
                        error={Boolean(errors.tel)}
                        autoComplete="booking-tel"
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        id="request"
                        name="request"
                        label="Request"
                        defaultValue={form.request}
                        fullWidth
                        multiline
                        rows={3}
                        inputRef={register}
                        autoComplete="booking-request"
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default BookingForm