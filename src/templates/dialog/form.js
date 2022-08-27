import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Header from './header'
import Submit from "../../components/atoms/submit";

const FormDialog = ({ open, title, fields, submitContext = {}, handleClose }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <Header title={title} handleClose={handleClose} />
                <Box mb="1.5rem" />

                <form>
                    <DialogContent>
                        <Grid container spacing={3}>
                            {fields}
                        </Grid>
                    </DialogContent>
                    <Box mb="0.5rem" />
                    <DialogActions>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="center" mb="1rem">
                                    <Submit
                                        fullWidth
                                        onClick={submitContext.handleSubmit}
                                    >
                                        {submitContext.text ? submitContext.text : '更新'}
                                    </Submit>
                                </Box>
                                {!!submitContext.aditional && (<>{submitContext.aditional}</>)}
                            </Grid>
                        </Grid>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default FormDialog