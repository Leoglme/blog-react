import React, {memo} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Hidden,
    IconButton,
    withStyles,
    Avatar
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import BookIcon from "@material-ui/icons/Book";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import classNames from "classnames";
const styles = theme => ({
    appBar: {
        boxShadow: theme.shadows[6],
        backgroundColor: theme.palette.common.white
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between"
    },
    menuButtonText: {
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.h6.fontWeight
    },
    brandText: {
        fontFamily: "'Baloo Bhaijaan', cursive",
        fontWeight: 400
    },
    noDecoration: {
        textDecoration: "none !important"
    },
    accountAvatar: {
        backgroundColor: theme.palette.randomColor.main,
        height: 32,
        width: 32,
        textTransform: 'uppercase',
        fontSize: '1.1rem',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(1.5),
            marginRight: theme.spacing(1.5),
        },
    },
});

function NavBar(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isConnected = user !== null;
    const {
        classes,
        openRegisterDialog,
        openLoginDialog,
        handleMobileDrawerOpen,
        handleMobileDrawerClose,
        mobileDrawerOpen,
        selectedTab
    } = props;
    let menuItems
    if (isConnected) {
        menuItems = [
            {
                link: "/",
                name: "Home",
                icon: <HomeIcon className="text-white"/>
            },
            {
                link: "/blog",
                name: "Blog",
                icon: <BookIcon className="text-white"/>
            },
            {
                link: "/user/blog/posts",
                name: "Add Article",
                icon: <CreateRoundedIcon className="text-white"/>
            },
            {
                link: "/user/blog",
                name: user.username,
                icon: <CreateRoundedIcon className="text-white"/>
            },
        ];
    } else {
        menuItems = [
            {
                link: "/",
                name: "Home",
                icon: <HomeIcon className="text-white"/>
            },
            {
                link: "/blog",
                name: "Blog",
                icon: <BookIcon className="text-white"/>
            },
            {
                name: "Register",
                onClick: openRegisterDialog,
                icon: <HowToRegIcon className="text-white"/>
            },
            {
                name: "Login",
                onClick: openLoginDialog,
                icon: <LockOpenIcon className="text-white"/>
            }
        ];
    }
    const firstLetterUser = user !== null ? user.username.charAt(0) : 'N/A';
    return (
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <div>
                        <Typography
                            variant="h4"
                            className={classes.brandText}
                            display="inline"
                            color="primary"
                        >
                            Bl
                        </Typography>
                        <Typography
                            variant="h4"
                            className={classes.brandText}
                            display="inline"
                            color="secondary"
                        >
                            og
                        </Typography>
                    </div>
                    <div>
                        <Hidden mdUp>
                            <IconButton
                                className={classes.menuButton}
                                onClick={handleMobileDrawerOpen}
                                aria-label="Open Navigation"
                            >
                                <MenuIcon color="primary"/>
                            </IconButton>
                        </Hidden>
                        <Hidden smDown>
                            {menuItems.map(element => {
                                if (element.link === '/user/blog'){
                                    return (
                                        <Link
                                            key={element.name}
                                            to={element.link}
                                            className={classes.noDecoration}
                                            onClick={handleMobileDrawerClose}
                                        >
                                            <Button
                                                color="secondary"
                                                size="large"
                                                classes={{text: classes.menuButtonText}}
                                            ><Avatar
                                                className={classNames(classes.accountAvatar)}>{firstLetterUser}
                                            </Avatar>{element.name}
                                            </Button>
                                        </Link>
                                    );
                                }
                                if (element.link) {
                                    return (
                                        <Link
                                            key={element.name}
                                            to={element.link}
                                            className={classes.noDecoration}
                                            onClick={handleMobileDrawerClose}
                                        >
                                            <Button
                                                color="secondary"
                                                size="large"
                                                classes={{text: classes.menuButtonText}}
                                            >
                                                {element.name}
                                            </Button>
                                        </Link>
                                    );
                                }
                                return (
                                    <Button
                                        color="secondary"
                                        size="large"
                                        onClick={element.onClick}
                                        classes={{text: classes.menuButtonText}}
                                        key={element.name}
                                    >
                                        {element.name}
                                    </Button>
                                );
                            })}
                        </Hidden>
                    </div>
                </Toolbar>
            </AppBar>
            <NavigationDrawer
                menuItems={menuItems}
                anchor="right"
                open={mobileDrawerOpen}
                selectedItem={selectedTab}
                onClose={handleMobileDrawerClose}
            />
        </div>
    );
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    handleMobileDrawerOpen: PropTypes.func,
    handleMobileDrawerClose: PropTypes.func,
    mobileDrawerOpen: PropTypes.bool,
    selectedTab: PropTypes.string,
    openRegisterDialog: PropTypes.func.isRequired,
    openLoginDialog: PropTypes.func.isRequired
};

export default withStyles(styles, {withTheme: true})(memo(NavBar));
