import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import format from "date-fns/format";
import classNames from "classnames";
import {Typography, Card, Box, withStyles, Button} from "@material-ui/core";
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded';

const styles = (theme) => ({
    img: {
        width: "100%",
        height: "auto",
        marginBottom: 8,
    },
    card: {
        boxShadow: theme.shadows[2],
    },
    noDecoration: {
        textDecoration: "none !important",
    },
    title: {
        transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut,
        }),
        cursor: "pointer",
        color: theme.palette.secondary.main,
        "&:hover": {
            color: theme.palette.secondary.dark,
        },
        "&:active": {
            color: theme.palette.primary.dark,
        },
    },
    link: {
        transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut,
        }),
        cursor: "pointer",
        color: theme.palette.primary.main,
        "&:hover": {
            color: theme.palette.primary.dark,
        },
    },
    showFocus: {
        "&:focus span": {
            color: theme.palette.secondary.dark,
        },
    },

    MuiButtonEndIcon: {
        marginLeft: 'unset'
    },

    Article__content: {
        display: '-webkit-box',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
        letterSpacing: 'var(--yt-link-letter-spacing, normal)',
        "-webkitLineClamp": '5',
        "-webkitBoxOrient": 'vertical',
        marginBottom: 16
    }
});

function BlogCard(props) {
    const {classes, url, src, date, title, snippet} = props;

    return (
        <Card className={classes.card}>
            {src && (
                <Link to={url} tabIndex={-1}>
                    <img src={src} className={classes.img} alt=""/>
                </Link>
            )}
            <Box p={2}>
                <Typography variant="body2" color="textSecondary">
                    {format(new Date(date * 1000), "PPP", {
                        awareOfUnicodeTokens: true,
                    })}
                </Typography>
                <Link
                    to={url}
                    className={classNames(classes.noDecoration, classes.showFocus)}
                >
                    <Typography variant="h6">
                        <span className={classNames(classes.title, 'title')}>{title}</span>
                    </Typography>
                </Link>
                <Typography className={classes.Article__content} variant="body1" color="textSecondary">
                    {snippet}
                </Typography>
                <Button
                    href={url}
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    endIcon={<DoubleArrowRoundedIcon/>}>
                    Read more
                </Button>
            </Box>
        </Card>
    );
}

BlogCard.propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
    snippet: PropTypes.string.isRequired,
    src: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(BlogCard);
