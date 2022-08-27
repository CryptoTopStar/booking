import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.tooltip + 1,
        color: '#fff',
    },
}));

const Progress = ({ processing }) => {
    const classes = useStyles()
    return (
        <>
            {!!processing && (
                <Backdrop className={classes.backdrop} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
        </>);
}

export default Progress