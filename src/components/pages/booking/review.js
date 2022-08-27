import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';

const ReviewForm = ({ form }) => {

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
                    <FormControl fullWidth>
                        <InputLabel htmlFor="component-simple">Date</InputLabel>
                        <Box mb="1rem" />
                        <InputBase id="date" defaultValue={form.dateText} disabled />
                    </FormControl>
                </Grid>
                {!!form.menu?.contentfulid && (
                    <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="component-simple">Menu</InputLabel>
                            <Box mb="1rem" />
                            <InputBase id="menu" defaultValue={form.menu.name} disabled />
                        </FormControl>
                    </Grid>
                )}
                {!!form.off?.contentfulid && (
                    <Grid item xs={12} md={12}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="component-simple">Off</InputLabel>
                            <Box mb="1rem" />
                            <InputBase id="off" defaultValue={form.off.name} disabled />
                        </FormControl>
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="component-simple">User name</InputLabel>
                        <Box mb="1rem" />
                        <InputBase id="userName" defaultValue={form.userName} disabled />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="component-simple">Tel</InputLabel>
                        <Box mb="1rem" />
                        <InputBase id="tel" defaultValue={form.tel} disabled />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="component-simple">Price</InputLabel>
                        <Box mb="1rem" />
                        <InputBase id="price" defaultValue={form.priceText} disabled />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="component-simple">Request</InputLabel>
                        <Box mb="1rem" />
                        <InputBase
                            id="request"
                            defaultValue={form.request}
                            multiline
                            rows={3}
                            disabled />
                    </FormControl>
                </Grid>
            </Grid>
        </>
    );
}

export default ReviewForm