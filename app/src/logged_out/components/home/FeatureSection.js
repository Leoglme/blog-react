import React, {useCallback, useEffect, useState} from "react";
import PropTypes, {array} from "prop-types";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";
import calculateSpacing from "./calculateSpacing";
import axios from "axios";
import BlogCard from "../blog/BlogCard";
import {useHistory} from "react-router";


function FeatureSection(props) {
  const { width } = props;
  const [blogPop, setBlogPop] = useState([]);


  function imageExists(image_url) {

    const http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status !== 404;

  }

  const popularBlog = useCallback(async () => {
     axios.get('http://localhost:4242/blog/trending/blog')
        .then(response => {
          const resPop = [];
          const articles =  response.data.populateArticle;
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
            resPop.push(post);
          })
          setBlogPop(resPop);
        }).catch(error => {
          const posts = [];
          posts.reverse();
          setBlogPop(posts);
          console.log(error);
        })
  }, [setBlogPop])


  useEffect(() => {
    popularBlog();
  }, [
    popularBlog,
  ]);

  let res;
  if (blogPop.length !== 0){
    res = blogPop;
  }
  const history = useHistory();
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom" style={{marginBottom: 100}}>
          Trending
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)} style={{ justifyContent: "center"}}>
              {res !== undefined ? (
                  res.map(blogPost => (
                      <Grid
                          item
                          xs={6}
                          md={4}
                          data-aos="zoom-in"
                          data-aos-delay='300'
                          key={blogPost.headline}
                      >
                        <BlogCard
                            onClick={() => {
                              history.push(blogPost.url);
                            }}
                            src={blogPost.src}
                            title={blogPost.title}
                            snippet={blogPost.snippet}
                            date={blogPost.date}
                            url={blogPost.url}
                        />
                      </Grid>
                  ))
              ) : (
                  <></>
              )}
          </Grid>
        </div>
      </div>
    </div>
  );
}

FeatureSection.propTypes = {
  width: PropTypes.string.isRequired
};

export default withWidth()(FeatureSection);
