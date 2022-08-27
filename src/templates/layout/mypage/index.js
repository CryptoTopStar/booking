import React from "react"
import { makeStyles } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { Helmet } from "react-helmet"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core"
import DialogContent from '@material-ui/core/DialogContent';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import theme from "../../../theme"
import ConfirmProvider from '../../../context/confirmProvider'
import { GlobalStateProvider } from '../../../context/globalState'
import ErrorBoundary from '../../../errorboundary'
import useDocumentTitle from '../../../hooks/useDocumentTitle'
import Header from './header'
import NavBar from './navbar'

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    wrapper: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        paddingTop: 64,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        }
    },
    contentContainer: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
    },
    content: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto'
    }
}));

const Index = ({ location, children }) => {
    const classes = useStyles();
    const title = useDocumentTitle(location);
    const [isMobileNavOpen, setMobileNavOpen] = React.useState(false);

    return (
        <ErrorBoundary>
            <Helmet>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <title>{title}</title>
            </Helmet>
            <SnackbarProvider maxSnack={3}>
                <GlobalStateProvider>
                    <ConfirmProvider>
                        <ThemeProvider theme={theme}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <div className={classes.root}>
                                    <Header onMobileNavOpen={() => setMobileNavOpen(true)} />
                                    <NavBar
                                        location={location}
                                        onMobileClose={() => setMobileNavOpen(false)}
                                        openMobile={isMobileNavOpen}
                                    />
                                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                                    <CssBaseline />
                                    <div className={classes.wrapper}>
                                        <div className={classes.contentContainer}>
                                            <div className={classes.content}>
                                                <DialogContent>
                                                    {children}
                                                </DialogContent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </MuiPickersUtilsProvider>
                        </ThemeProvider>
                    </ConfirmProvider>
                </GlobalStateProvider>
            </SnackbarProvider>
        </ErrorBoundary>
    )
}

export default Index