import React from 'react';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    AppBar,
    Box,
    Hidden,
    IconButton,
    Toolbar,
    makeStyles
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../../../components/Logo';

const useStyles = makeStyles(theme => ({
    root: {},
    title: {
        marginLeft: theme.spacing(2),
        flexGrow: 1,
    },
}));

const TopBar = ({
    className,
    onMobileNavOpen,
    ...rest
}) => {
    const classes = useStyles();

    return (
        <AppBar
            className={clsx(classes.root, className)}
            elevation={0}
            {...rest}
        >
            <Toolbar>
                <Link href="/">
                    <Logo />
                </Link>
                <Typography variant="h6" className={classes.title}>
                    {process.env.GATSBY_SALON_NAME}
                </Typography>
                <Box flexGrow={1} />
                <Hidden lgUp>
                    <IconButton
                        color="inherit"
                        onClick={onMobileNavOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    className: PropTypes.string,
    onMobileNavOpen: PropTypes.func
};

export default TopBar;