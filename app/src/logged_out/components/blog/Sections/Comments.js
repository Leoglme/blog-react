import React, {useState} from 'react'
import {Input} from 'antd';
import ReplyComment from './ReplyComment';
import axios from 'axios';
import {Avatar, Button, TextField, withStyles} from "@material-ui/core";
import SingleComment from './SingleComment';
import {red} from "@material-ui/core/colors";
import classNames from "classnames";

const {TextArea} = Input;
const styles = (theme) => ({
    reviewCount: {
        color: 'rgb(3, 3, 3)',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.1,
    },
    hr: {
        color: 'rgb(255,255,255)'
    },
    accountAvatar: {
        backgroundColor: theme.palette.randomColor.main,
        height: 40,
        width: 40,
        textTransform: 'uppercase',
        fontSize: '1.1rem',
        marginRight: theme.spacing(2),
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(1.5),
            marginRight: theme.spacing(1.5),
        },
    }
});

function Comments(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = user !== null;
    const [Comment, setComment] = useState("")
    const {classes} = props;
    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: Comment,
            writer: user._id,
            postId: props.postId
        }
        axios.post('http://localhost:4242/api/comments/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }
    const firstLetterUser = user !== null ? user.username.charAt(0) : 'N/A';
    return (
        <div>
            <br/>
            <p className={classes.reviewCount}>{props.CommentLists.length === 0 ? 0 : props.CommentLists.length - 1} reviews</p>
            <hr className={classes.hr}/>
            {isLoggedIn ? (
                <form style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}} onSubmit={onSubmit}>
                    <div style={{width: '100%', display: 'flex', marginTop: 20}}>
                        <Avatar
                            className={classNames(classes.accountAvatar)}>{firstLetterUser}
                        </Avatar>
                        <TextField
                            style={{width: '100%', borderRadius: '5px', paddingBottom: 8}}
                            id="standard-textarea"
                            placeholder="Add a public comment ..."
                            value={Comment}
                            onChange={handleChange}
                            multiline
                        />
                    </div>

                    <br/>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                        <Button style={{width: '20%', height: '38px'}} onClick={onSubmit}>
                            Cancel
                        </Button>
                        <Button variant="contained"
                                color="secondary"
                                style={{marginLeft: 8, width: '20%', height: '38px'}}
                                disabled={Comment.length === 0}
                                onClick={onSubmit}>
                            Add a comment
                        </Button>
                    </div>
                </form>
            ) : (
                <></>
            )}
            {/* Comment Lists  */}
            {console.log(props.CommentLists)}

            {props.CommentLists && props.CommentLists.map((comment, i) => (
                (!comment.responseTo &&
                    <React.Fragment key={i}>
                        <SingleComment BlogAuthor={props.BlogAuthor} comment={comment} postId={props.postId} refreshFunction={props.refreshFunction}/>
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId}
                                      parentCommentId={comment._id} refreshFunction={props.refreshFunction}/>
                    </React.Fragment>
                )
            ))}

        </div>
    )
}

export default withStyles(styles, {withTheme: true})(Comments);
