import React, {memo, useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Switch} from "react-router-dom";
import PropsRoute from "../../shared/components/PropsRoute";
import Home from "./home/Home";
import Blog from "./blog/Blog";
import BlogPost from "./blog/BlogPost";
import useLocationBlocker from "../../shared/functions/useLocationBlocker";
import axios from "axios";
import {logger} from "workbox-core/_private";

function Routing(props) {
    const {selectBlog, selectHome} = props;
    const [blogPosts, setBlogPosts] = useState([]);
    function imageExists(image_url) {

        const http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();

        return http.status !== 404;

    }
    const fetchRandomPosts = useCallback(async () => {
        const ApiUrl = 'http://localhost:4242/blog/posts'
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
                    username: article.article__username,
                    category: article.article__category
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
    useEffect(() => {fetchRandomPosts().then(r => console.log('response', r))}, [fetchRandomPosts]);
    useLocationBlocker();
    console.log("blogPosts", blogPosts);
    return (
        <Switch>
            {blogPosts.map((post) => (
                <PropsRoute
                    paramsId={post.id}
                    author={post.username}
                    path={post.url}
                    component={BlogPost}
                    title={post.title}
                    key={post.title}
                    src={post.src}
                    date={post.date}
                    content={post.content}
                    otherArticles={blogPosts.filter(
                        (blogPost) => blogPost.id !== post.id
                    )}
                />
            ))}
            <PropsRoute
                exact
                path="/blog"
                component={Blog}
                selectBlog={selectBlog}
                blogPosts={blogPosts}
            />
            <PropsRoute
                exact
                path="/blog/:id"
                component={Blog}
                selectBlog={selectBlog}
                blogPosts={blogPosts}
            />
            <PropsRoute path="/" component={Home} selectHome={selectHome}/>
        </Switch>
    );
}

Routing.propTypes = {
    blogposts: PropTypes.arrayOf(PropTypes.object),
    selectHome: PropTypes.func.isRequired,
    selectBlog: PropTypes.func.isRequired,
};

export default memo(Routing);
