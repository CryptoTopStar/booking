import React from "react"
import { SnackbarProvider } from 'notistack';
import { Helmet } from "react-helmet"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider } from "@material-ui/core"
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import theme from "../../../theme"
import Header from './header'
import Footer from './footer'
import ConfirmProvider from '../../../context/confirmProvider'
import InquiryProvider from '../../../context/inquiryProvider'
import { GlobalStateProvider } from '../../../context/globalState'
import ErrorBoundary from '../../../errorboundary'
import useDocumentTitle from '../../../hooks/useDocumentTitle'

import "./layout.css"

const Index = ({ location, children }) => {
    const title = useDocumentTitle(location);
    const description = 'ネイルなDemo Salonで。オンライン予約もこちらから。'
    const url = 'https://festive-swartz-405bdc.netlify.app/'
    const imageUrl = 'https://thirosue.github.io/hosting-image/booking/screenshot.png'

    return (
        <ErrorBoundary>
            <Helmet>
                <html lang="ja" />
                <title>{title}</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <meta name="Description" content={description} />
                <meta property="og:site_name" content={process.env.GATSBY_SALON_NAME} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="ja_JP" />
                <meta property="og:image" content={imageUrl} />
            </Helmet>
            <SnackbarProvider maxSnack={3}>
                <GlobalStateProvider>
                    <ConfirmProvider>
                        <ThemeProvider theme={theme}>
                            <InquiryProvider>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Header />
                                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                                    <CssBaseline />
                                    {children}
                                    <Footer />
                                </MuiPickersUtilsProvider>
                            </InquiryProvider>
                        </ThemeProvider>
                    </ConfirmProvider>
                </GlobalStateProvider>
            </SnackbarProvider>
        </ErrorBoundary>
    )
}

export default Index