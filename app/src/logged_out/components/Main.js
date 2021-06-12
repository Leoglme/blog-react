import React, {memo, useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types";
import AOS from "aos/dist/aos";
import {withStyles} from "@material-ui/core";
import NavBar from "./navigation/NavBar";
import Footer from "./footer/Footer";
import "aos/dist/aos.css";
import CookieRulesDialog from "./cookies/CookieRulesDialog";
import CookieConsent from "./cookies/CookieConsent";
import dummyBlogPosts from "../dummy_data/blogPosts";
import DialogSelector from "./register_login/DialogSelector";
import Routing from "./Routing";
import smoothScrollTop from "../../shared/functions/smoothScrollTop";
import axios from "axios";

AOS.init({once: true});

const styles = (theme) => ({
    wrapper: {
        backgroundColor: theme.palette.common.white,
        overflowX: "hidden",
    },
});


function Main(props) {
    const {classes} = props;
    const [selectedTab, setSelectedTab] = useState(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(null);
    const [isCookieRulesDialogOpen, setIsCookieRulesDialogOpen] = useState(false);

    const selectHome = useCallback(() => {
        smoothScrollTop();
        document.title =
            "Blog - React Application";
        setSelectedTab("Home");
    }, [setSelectedTab]);

    const selectBlog = useCallback(() => {
        smoothScrollTop();
        document.title = "Blog - React Application";
        setSelectedTab("Blog");
    }, [setSelectedTab]);

    const openLoginDialog = useCallback(() => {
        setDialogOpen("login");
        setIsMobileDrawerOpen(false);
    }, [setDialogOpen, setIsMobileDrawerOpen]);

    const closeDialog = useCallback(() => {
        setDialogOpen(null);
    }, [setDialogOpen]);

    const openRegisterDialog = useCallback(() => {
        setDialogOpen("register");
        setIsMobileDrawerOpen(false);
    }, [setDialogOpen, setIsMobileDrawerOpen]);

    const openTermsDialog = useCallback(() => {
        setDialogOpen("termsOfService");
    }, [setDialogOpen]);

    const handleMobileDrawerOpen = useCallback(() => {
        setIsMobileDrawerOpen(true);
    }, [setIsMobileDrawerOpen]);

    const handleMobileDrawerClose = useCallback(() => {
        setIsMobileDrawerOpen(false);
    }, [setIsMobileDrawerOpen]);

    const openChangePasswordDialog = useCallback(() => {
        setDialogOpen("changePassword");
    }, [setDialogOpen]);

    function imageExists(image_url) {

        const http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();

        return http.status !== 404;

    }
    const fetchBlogPosts = useCallback(() => {
        axios({
            method: 'get',
            withCredentials: true,
            url: `http://localhost:4242/blog/posts/`
        }).then(res => {
            const articles = res.data.articles;
            const blogPosts = articles.map((blogPost) => {
                const image = `/uploads/` + blogPost.article__image;
                const imageDefault = `/uploads/blogPost2.jpg`;
                blogPost.title = blogPost.article__title;
                blogPost.date = parseInt(blogPost.article__date);
                blogPost.content = blogPost.article__content;
                blogPost.src = imageExists(image) ? image : imageDefault;
                blogPost.url = `/blog/post/${blogPost._id}`;
                blogPost.params = `?id=${blogPost._id}`;
                return blogPost;
            });
        }).catch(error => {
            console.log(error);
        })
    }, [setBlogPosts]);

    const handleCookieRulesDialogOpen = useCallback(() => {
        setIsCookieRulesDialogOpen(true);
    }, [setIsCookieRulesDialogOpen]);

    const handleCookieRulesDialogClose = useCallback(() => {
        setIsCookieRulesDialogOpen(false);
    }, [setIsCookieRulesDialogOpen]);

    useEffect(fetchBlogPosts, [fetchBlogPosts]);

    return (
        <div className={classes.wrapper}>
            {!isCookieRulesDialogOpen && (
                <CookieConsent
                    handleCookieRulesDialogOpen={handleCookieRulesDialogOpen}
                />
            )}
            <DialogSelector
                openLoginDialog={openLoginDialog}
                dialogOpen={dialogOpen}
                onClose={closeDialog}
                openTermsDialog={openTermsDialog}
                openRegisterDialog={openRegisterDialog}
                openChangePasswordDialog={openChangePasswordDialog}
            />
            <CookieRulesDialog
                open={isCookieRulesDialogOpen}
                onClose={handleCookieRulesDialogClose}
            />
            <NavBar
                selectedTab={selectedTab}
                selectTab={setSelectedTab}
                openLoginDialog={openLoginDialog}
                openRegisterDialog={openRegisterDialog}
                mobileDrawerOpen={isMobileDrawerOpen}
                handleMobileDrawerOpen={handleMobileDrawerOpen}
                handleMobileDrawerClose={handleMobileDrawerClose}
            />
            <Routing
                blogPosts={blogPosts}
                selectHome={selectHome}
                selectBlog={selectBlog}
            />
            <Footer/>
        </div>
    );
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(memo(Main));
