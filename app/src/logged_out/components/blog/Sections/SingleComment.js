import React, {useCallback, useState} from 'react'
import {Comment, Input} from 'antd';
import Axios from 'axios';
import classNames from "classnames";
import {Avatar, Button, TextField, Tooltip, withStyles} from "@material-ui/core";
import moment from 'moment';
import VertOptions from "../../../../shared/components/VertOptions";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import theme from "../../../../theme";
import ConfirmationDialog from "../../../../shared/components/ConfirmationDialog";
import axios from "axios";
import ConsecutiveSnackbarMessages from "../../../../shared/components/ConsecutiveSnackbarMessages";

const {TextArea} = Input;
const styles = (theme) => ({
    appBar: {
        boxShadow: theme.shadows[6],
        backgroundColor: theme.palette.common.white,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            marginLeft: 0,
        },
    },
    appBarToolbar: {
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
        [theme.breakpoints.up("md")]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
        },
        [theme.breakpoints.up("lg")]: {
            paddingLeft: theme.spacing(4),
            paddingRight: theme.spacing(4),
        },
    },
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
    },
    drawerPaper: {
        height: "100%vh",
        whiteSpace: "nowrap",
        border: 0,
        width: theme.spacing(7),
        overflowX: "hidden",
        marginTop: theme.spacing(8),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
        },
        backgroundColor: theme.palette.common.black,
    },
    smBordered: {
        [theme.breakpoints.down("xs")]: {
            borderRadius: "50% !important",
        },
    },
    menuLink: {
        textDecoration: "none",
        color: theme.palette.text.primary,
    },
    iconListItem: {
        width: "auto",
        borderRadius: theme.shape.borderRadius,
        paddingTop: 11,
        paddingBottom: 11,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    textPrimary: {
        color: theme.palette.primary.main,
    },
    mobileItemSelected: {
        backgroundColor: `${theme.palette.primary.main} !important`,
    },
    brandText: {
        fontFamily: "'Baloo Bhaijaan', cursive",
        fontWeight: 400,
    },
    username: {
        paddingLeft: 0,
        paddingRight: theme.spacing(2),
    },
    justifyCenter: {
        justifyContent: "center",
    },
    permanentDrawerListItem: {
        justifyContent: "center",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    author: {
        textDecoration: 'none',
        color: "var(--yt-spec-text-primary)",
        fontSize: 13,
        fontWeight: '500',
        lineHeight: '18px',
        marginRight: 8,
        fontFamily: 'Roboto, Arial, sans-serif'
    }
});

function SingleComment(props) {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = user !== null;
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)
    const [currentId, setCurrentId] = useState(false)
    const [pushMessageToSnackbar, setPushMessageToSnackbar] = useState(null)
    const {classes} = props;
    const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
    const [isDeletePostDialogLoading, setIsDeletePostDialogLoading] = useState(
        false
    );

    const closeDeletePostDialog = useCallback(() => {
        setIsDeletePostDialogOpen(false);
        setIsDeletePostDialogLoading(false);
    }, [setIsDeletePostDialogOpen, setIsDeletePostDialogLoading]);
    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const getPushMessageFromChild = useCallback(
        (pushMessage) => {
            setPushMessageToSnackbar(() => pushMessage);
        },
        [setPushMessageToSnackbar]
    );

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue
        }


        Axios.post('http://localhost:4242/api/comments/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("")
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    function randomColor() {
        let hex = Math.floor(Math.random() * 0xFFFFFF);
        return "#" + hex.toString(16);
    }

    const actions = [
        <span style={{paddingTop: 0}} onClick={openReply} key="comment-basic-reply-to">Reply</span>,
    ];
    const firstLetterUser = props.comment.writer.name !== null ? props.comment.writer.name.charAt(0) : 'N/A';


    /*Delete comment action*/
    const removeComment = useCallback((id) => {
        setCurrentId(id)
        setIsDeletePostDialogOpen(true);
    }, [setIsDeletePostDialogOpen, setCurrentId]);


    const deleteComment = useCallback(() => {
        setIsDeletePostDialogLoading(true);
        setTimeout(() => {
            const currentComment = document.querySelector('[data-comment="' + currentId + '"]')
            currentComment.style.display = "none";
            axios.delete('http://localhost:4242/api/comments/deleteComment/' + currentId,)
                .then(r => console.log(r))
                .catch(error => console.log(error))
            pushMessageToSnackbar({
                text: "The comment has been deleted successfully",
            });
            closeDeletePostDialog();
        }, 1500);
    }, [
        setIsDeletePostDialogLoading,
        pushMessageToSnackbar,
        closeDeletePostDialog, currentId
    ]);
    let randomCol;
    if (user === null || props.comment.writer.name === user.username){
        randomCol = {backgroundColor: theme.palette.randomColor.main}
    }else{
        randomCol = {backgroundColor: randomColor()}
    }
    const isAuthor = user !== null && props.BlogAuthor === user.username;
    return (
        <div data-comment={props.comment._id}>
            <Comment
                actions={isLoggedIn ? actions : null}
                author={<a className={classes.author} href={'/blog/' + props.comment.writer.name}>{props.comment.writer.name}</a>}
                avatar={
                    <Avatar
                        style={randomCol}
                        className={classNames(classes.accountAvatar)}>{firstLetterUser}
                    </Avatar>
                }
                content={
                    <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                        <p>{props.comment.content}</p>
                        {isAuthor ? (
                            <VertOptions classe={classes.dot} color={'rgb(96, 96, 96)'} items={
                                [{
                                    name: "Delete",
                                    onClick: () => {
                                        removeComment(props.comment._id)
                                    },
                                    icon: <DeleteIcon/>,
                                }]
                            }/>
                        ) : (
                            <></>
                        )}
                    </div>

                }
                datetime={
                    <Tooltip title={moment().format('DD/MM/YYYY HH:mm:ss')}>
                        <span>{moment.utc(props.comment.createdAt).fromNow()}</span>
                    </Tooltip>
                }
            />
            {OpenReply &&
            <form style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}} onSubmit={onSubmit}>
                <div style={{width: '100%', display: 'flex', marginTop: 20}}>
                    <Avatar
                        className={classNames(classes.accountAvatar)}>{firstLetterUser}
                    </Avatar>
                    <TextField
                        style={{width: '100%', borderRadius: '5px', paddingBottom: 8}}
                        id="standard-textarea"
                        placeholder="Add a public response "
                        value={CommentValue}
                        onChange={handleChange}
                        multiline
                    />
                </div>

                <br/>
                <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                    <Button style={{width: '20%', height: '38px', maxWidth: 95}} onClick={onSubmit}>
                        Cancel
                    </Button>
                    <Button variant="contained"
                            color="secondary"
                            style={{marginLeft: 8, width: '20%', height: '38px', maxWidth: 105}}
                            disabled={CommentValue.length === 0}
                            onClick={onSubmit}>
                        Reply
                    </Button>
                </div>
            </form>
            }

            <ConfirmationDialog
                open={isDeletePostDialogOpen}
                title="Confirmation"
                content="Are you sure you want to delete this comment ?"
                onClose={closeDeletePostDialog}
                loading={isDeletePostDialogLoading}
                onConfirm={deleteComment}
            />

            <ConsecutiveSnackbarMessages
                getPushMessageFromChild={getPushMessageFromChild}
            />

        </div>
    )
}

export default (withStyles(styles, {withTheme: true})(SingleComment))
