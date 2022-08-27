import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Header from './header'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Action = props => {
    const isExistsAction = props.action;
    if (isExistsAction) {
        return props.action;
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mb="1rem">
                    <Button fullWidth size="large" variant="contained" onClick={props.handleClose} color="primary">
                        閉じる
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}

const FullScreenDialog = ({ open, context = {}, handleClose }) => {
    return (
        <>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Header title={context.title ? context.title : 'Info'} handleClose={handleClose} />
                <Box mb="1.5rem" />
                <DialogContent>
                    <div id="dialog-root-position"></div> {/* for scroll */}
                    {context.content}
                </DialogContent>
                <Box mb="0.5rem" />
                <DialogActions>
                    <Action action={context.action} handleClose={handleClose} />
                </DialogActions>
            </Dialog>
        </>
    );
}

export default FullScreenDialog