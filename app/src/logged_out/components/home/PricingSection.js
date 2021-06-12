import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
    Grid,
    Typography,
    isWidthUp,
    withWidth,
    withStyles
} from "@material-ui/core";
import PriceCard from "./PriceCard";
import calculateSpacing from "./calculateSpacing";
import axios from "axios";
import {useHistory} from "react-router";
import BlogCard from "../blog/BlogCard";

const styles = theme => ({
    containerFix: {
        [theme.breakpoints.down("md")]: {
            paddingLeft: theme.spacing(6),
            paddingRight: theme.spacing(6)
        },
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4)
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },
        overflow: "hidden",
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    cardWrapper: {
        [theme.breakpoints.down("xs")]: {
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 340
        }
    },
    cardWrapperHighlighted: {
        [theme.breakpoints.down("xs")]: {
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 360
        }
    }
});

function PricingSection(props) {
    const {width, classes} = props;

    const [blogPop, setBlogPop] = useState([]);


    function imageExists(image_url) {

        const http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        http.send();

        return http.status !== 404;

    }

    const popularBlog = useCallback(async () => {
        let count = 300
        axios.get('http://localhost:4242/blog/newest/blog')
            .then(response => {
                const resPop = [];
                const articles = response.data.populateArticle;
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
                        aos: count
                    };
                    count += 300;
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
    if (blogPop.length !== 0) {
        res = blogPop;
    }
    const history = useHistory();

  return (
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <div className="container-fluid lg-p-top">
          <Typography variant="h3" align="center" className="lg-mg-bottom" style={{marginBottom: 100}}>
            Newest
          </Typography>
          <div className="container-fluid">
            <Grid container spacing={calculateSpacing(width)} style={{ justifyContent: "center"}}>
              {res !== undefined ? (
                  res.map(blogPost => (
                      <Grid
                          item
                          xs={6}
                          md={4}
                          data-aos="zoom-in-up"
                          data-aos-delay={blogPost.aos}
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

PricingSection.propTypes = {
    width: PropTypes.string.isRequired
};

export default withStyles(styles, {withTheme: true})(
    withWidth()(PricingSection)
);
