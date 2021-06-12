import React, {useCallback, useEffect, useState} from "react";
import PropTypes, {array} from "prop-types";
import classNames from "classnames";
import Fuse from 'fuse.js'
import {
    Grid,
    Box,
    isWidthUp,
    withWidth,
    withStyles,
    InputBase,
    fade,
    IconButton,
    Paper,
    Divider
} from "@material-ui/core";
import BlogCard from "./BlogCard";
import axios from "axios";
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import MenuIcon from "@material-ui/icons/Menu";
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
    noDecoration: {
        textDecoration: "none !important",
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
});

function getVerticalBlogPosts(width, blogPosts, search) {
    const gridRows = [[], [], []];
    let rows;
    let xs;
    if (isWidthUp("md", width)) {
        rows = 3;
        xs = 4;
    } else if (isWidthUp("sm", width)) {
        rows = 2;
        xs = 6;
    } else {
        rows = 1;
        xs = 12;
    }
    let options = {
        keys: [
            "title",
            "content",
            "category"
        ]
    }


    function searchAlgo(){
        let fuse = new Fuse(blogPosts, options)
        let filterResult = fuse.search(search.toLowerCase())
        if(search.length === 0){
            blogPosts.filter((val) => {
                if (search === ''){
                    return val;
                }else if(val.title.toLowerCase().includes(search.toLowerCase())){
                    return val;
                }
            }).forEach((blogPost, index) => {
                gridRows[index % rows].push(
                    <Grid key={blogPost.id} item xs={12}>
                        <Box mb={3}>
                            <BlogCard
                                onClick={() => {
                                    console.log('redirect too')
                                }}
                                src={blogPost.src}
                                title={blogPost.title}
                                snippet={blogPost.snippet}
                                date={blogPost.date}
                                url={blogPost.url}
                            />
                        </Box>
                    </Grid>
                );
            });
        }else{
            filterResult.forEach((blogPost, index) => {
                gridRows[index % rows].push(
                    <Grid key={blogPost.item.id} item xs={12}>
                        <Box mb={3}>
                            <BlogCard
                                onClick={() => {
                                    console.log('redirect too')
                                }}
                                src={blogPost.item.src}
                                title={blogPost.item.title}
                                snippet={blogPost.item.snippet}
                                date={blogPost.item.date}
                                url={blogPost.item.url}
                            />
                        </Box>
                    </Grid>
                );
            });
        }
    }
    searchAlgo();




    return gridRows.map((element, index) => (
        <Grid key={index} item xs={xs}>
            {element}
        </Grid>
    ));
}
function imageExists(image_url) {

  const http = new XMLHttpRequest();

  http.open('HEAD', image_url, false);
  http.send();

  return http.status !== 404;

}
function Blog(props) {
    const {classes, width, selectBlog} = props;
    const [blogPosts, setBlogPosts] = useState([]);
    const [search, setSearch] = useState("");
    const fetchRandomPosts = useCallback(async () => {
        const idProfile = props.match.params.id;
        const ApiUrl = props.match.params.id === undefined
            ? 'http://localhost:4242/blog/posts'
            : "http://localhost:4242/blog/posts/" + props.match.params.id
        axios({
            method: 'get',
            withCredentials: true,
            url: ApiUrl
        }).then(res => {
            const posts = [];
            const articles = res.data.articles;
            articles.forEach((article) => {
                const image = `/uploads/` + article.article__image;
                const imageDefault = `/uploads/blogPost2.jpg`;
                const post = {
                    url: '/blog/post/' + article._id,
                    title: article.article__title,
                    id: article._id,
                    date: parseInt(article.article__date),
                    src: imageExists(image) ? image : imageDefault,
                    snippet: article.article__content,
                    content: article.article__content,
                };
                posts.push(post);
            })

            // posts.reverse();
            setBlogPosts(posts);
        }).catch(error => {
            const posts = [];
            posts.reverse();
            setBlogPosts(posts);
            console.log(error);
        })

    }, [setBlogPosts]);
    useEffect(() => {
        selectBlog();
        fetchRandomPosts()
    }, [fetchRandomPosts]);

    return (<>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            className={classNames(classes.wrapper, "lg-p-top")}
            id={'results'}
        >
            <div className={classes.blogContentWrapper} style={{display: 'flex', justifyContent: 'flex-end', paddingBottom: 80}}>
                <Paper component="form" className={classes.root}>
                    <InputBase
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                        className={classes.input}
                        placeholder="Search for a title, description, category "
                        inputProps={{ 'aria-label': 'search google maps' , 'classe': 'search'}}
                    />
                    <IconButton className={classes.iconButton} aria-label="search">
                        <SearchRoundedIcon />
                    </IconButton>
                </Paper>
            </div>
            <div className={classNames(classes.blogContentWrapper, 'list')}>
                <Grid container spacing={3}>
                    {getVerticalBlogPosts(width, blogPosts, search)}
                </Grid>
            </div>
        </Box>
        );
    </>)
}

Blog.propTypes = {
    selectBlog: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    width: PropTypes.string.isRequired,
    blogPosts: PropTypes.arrayOf(PropTypes.object),
};

export default withWidth()(withStyles(styles, {withTheme: true})(Blog));
