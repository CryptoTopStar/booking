import React, { useEffect } from 'react';
import { navigate } from "gatsby"
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Home as HomeIcon,
  LogOut as LogOutIcon,
} from 'react-feather';
import NavItem from './navItem';
import GlobalContext from '../../../../context/global-context'
import AuthService from "../../../../services/auth";
import useConfirm from '../../../../hooks/useConfirm'

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ location, onMobileClose, openMobile }) => {
  const context = React.useContext(GlobalContext);
  const confirm = useConfirm();
  const classes = useStyles();

  useEffect(() => {
    if (!context.state.signedIn) navigate('/')
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const signOut = async () => {
    await AuthService.signOut()
    context.updateState({
      signedIn: false,
      session: {
        username: null
      }
    })
    confirm({ alert: true, description: 'ログアウトしました' })
      .then(() => {
        navigate('/')
      })
  };

  const items = [
    {
      icon: HomeIcon,
      title: 'Home',
      handleAction: () => navigate('/')
    },
    {
      icon: LogOutIcon,
      title: 'LogOut',
      handleAction: async () => {
        await signOut()
      }
    }
  ];

  const content = (
    <GlobalContext.Consumer>
      {context => (
        <Box
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            p={2}
          >
            <Typography
              variant="subtitle1"
            >
              {context.state.session.username}
            </Typography>
          </Box>
          <Divider />
          <Box p={2}>
            <List>
              {items.map((item) => (
                <NavItem
                  onClick={item.handleAction}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ))}
            </List>
          </Box>
        </Box>
      )}
    </GlobalContext.Consumer>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
