import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import format from "date-fns/format";
import {Grid, Typography, Card, Box, withStyles, Avatar} from "@material-ui/core";
import BlogCard from "./BlogCard";
import ShareButton from "../../../shared/components/ShareButton";
import ZoomImage from "../../../shared/components/ZoomImage";
import smoothScrollTop from "../../../shared/functions/smoothScrollTop";
import Comments from "./Sections/Comments";
import axios from "axios";
import {Link} from "react-router-dom";

const styles = (theme) => ({
    blogContentWrapper: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
        maxWidth: 1280,
        width: "100%",
    },
    wrapper: {
        minHeight: "60vh",
    },
    img: {
        maxHeight: 800,
        objectFit: "cover",
        objectPosition: "center center",
        width: "100%",
        height: "auto",
    },
    card: {
        boxShadow: theme.shadows[4],
    },
    accountAvatar: {
        backgroundColor: theme.palette.randomColor.main,
        height: 38,
        width: 38,
        textTransform: 'uppercase',
        fontSize: '1.1rem',
        marginRight: 10,
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(1.5),
            marginRight: theme.spacing(1.5),
        },
    },
    infoUser: {
        display: 'flex',
        flexDirection: 'column'
    },
    userLink: {
        color: "#030303",
        fontSize: '1rem',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '0.00938em',
        textDecoration: 'none',
        textTransform: 'capitalize'
    },
    userInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 16
    }
});

function BlogPost(props) {
    const {classes, date, title, src, content, otherArticles, author} = props;
    const [CommentLists, setCommentLists] = useState([])
    const firstLetterUser = author !== null ? author.charAt(0) : 'N/A';
    useEffect(() => {
        document.title = `React - ${title}`;
        smoothScrollTop();
    }, [title]);


    /*Comments section*/

    const postVariable = {
        postId: props.paramsId
    }
    useEffect(() => {
        axios.post('http://localhost:4242/api/comments/getComments', postVariable)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get video Info')
                }
            })
    }, [])

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <Box
            className={classNames("lg-p-top", classes.wrapper)}
            display="flex"
            justifyContent="center"
        >
            <div className={classes.blogContentWrapper}>
                <Grid container spacing={5}>
                    <Grid item md={9}>
                        <Card className={classes.card}>
                            <Box pt={3} pr={3} pl={3} pb={2}>
                                <Typography variant="h4">
                                    <b>{title}</b>
                                </Typography>
                                <div className={classes.userInfoContainer}>
                                    <Avatar
                                        className={classNames(classes.accountAvatar)}>{firstLetterUser}
                                    </Avatar>
                                    <div className={classes.infoUser}>
                                        <Link className={classes.userLink} to={"/blog/admin"} variant="body2">
                                            {author}
                                        </Link>
                                        <Typography variant="body1" color="textSecondary" style={{fontSize: '.8rem'}}>
                                            {format(new Date(date * 1000), "dd MMMM yyyy, HH:MM", {
                                                awareOfUnicodeTokens: true,
                                            })}
                                        </Typography>
                                    </div>
                                </div>
                            </Box>
                            <ZoomImage className={classes.img} src={src} alt=""/>
                            <Box p={3}>
                                {content}
                                <Box pt={2}>
                                    <Grid spacing={1} container>
                                        {["Facebook", "Twitter", "Reddit", "Tumblr"].map(
                                            (type, index) => (
                                                <Grid item key={index}>
                                                    <ShareButton
                                                        type={type}
                                                        title="React SaaS Template"
                                                        description="I found an awesome template for an webapp using React!"
                                                        disableElevation
                                                        variant="contained"
                                                        className="text-white"
                                                        classes={{
                                                            label: "text-white",
                                                        }}
                                                    />
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </Box>
                            </Box>
                        </Card>
                        <Comments BlogAuthor={author} CommentLists={CommentLists} postId={props.paramsId} refreshFunction={updateComment}/>
                    </Grid>
                    <Grid item md={3}>
                        <Typography variant="h6" paragraph>
                            Other articles
                        </Typography>
                        {otherArticles.map((blogPost) => (
                            <Box key={blogPost.id} mb={3}>
                                <BlogCard
                                    title={blogPost.title}
                                    snippet={blogPost.snippet}
                                    date={blogPost.date}
                                    url={`${blogPost.url}`}
                                />
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            </div>
        </Box>
    );
}

BlogPost.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    src: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    otherArticles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles, {withTheme: true})(BlogPost);
