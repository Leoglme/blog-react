import React, {useState, useCallback, useRef, Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
    Box, Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid, IconButton,
    Input,
    InputLabel,
    TextField, Typography, withStyles
} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import EmojiTextArea from "../../../shared/components/EmojiTextArea";
import CloseIcon from "@material-ui/icons/Close";
import Dropzone from "../../../shared/components/Dropzone";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import {logger} from "workbox-core/_private";

const styles = (theme) => ({
    card: {
        padding: 20
    },
    right: {display: 'flex', justifyContent: 'flex-end'},
    floatButtonWrapper: {
        position: "absolute",
        top: theme.spacing(1),
        right: theme.spacing(1),
        zIndex: 1000,
    },
    inputRoot: {
        width: 190,
        "@media (max-width:  400px)": {
            width: 160,
        },
        "@media (max-width:  360px)": {
            width: 140,
        },
        "@media (max-width:  340px)": {
            width: 120,
        },
    },
    uploadIcon: {
        fontSize: 48,
        transition: theme.transitions.create(["color", "box-shadow", "border"], {
            duration: theme.transitions.duration.short,
            easing: theme.transitions.easing.easeInOut,
        }),
    },
    imgWrapper: {position: "relative"},
    img: {
        width: "100%",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: theme.shape.borderRadius,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    uploadText: {
        transition: theme.transitions.create(["color", "box-shadow", "border"], {
            duration: theme.transitions.duration.short,
            easing: theme.transitions.easing.easeInOut,
        }),
    },
    numberInput: {
        width: 110,
    },
    numberInputInput: {
        padding: "9px 34px 9px 14.5px",
    },
    emojiTextArea: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginRight: -1,
    },
    dNone: {
        display: "none",
    },
});

function UpdateArticle(props) {
    const {theme, classes, history, selectUpdateArticle, pushMessageToSnackbar} = props;
    useEffect(selectUpdateArticle, [selectUpdateArticle]);
    const [isLoading, setIsLoading] = useState(false);
    const [onClose, setOnClose] = useState(null);
    const [files, setFiles] = useState(null);
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState();
    const [newFiles, setNewFiles] = useState();
    const [status, setStatus] = useState(null);
    const [contentValue, setContentValue] = useState(null);
    const [article, setArticle] = useState();
    const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const registerTermsCheckbox = useRef();
    const blogTitle = useRef();

    const onDrop = useCallback(
        (acceptedFiles, rejectedFiles) => {
            if (acceptedFiles.length + rejectedFiles.length > 1) {
                pushMessageToSnackbar({
                    isErrorMessage: true,
                    text: "You cannot upload more than one file at once",
                });
            } else if (acceptedFiles.length === 0) {
                pushMessageToSnackbar({
                    isErrorMessage: true,
                    text: "The file you wanted to upload isn't an image",
                });
            } else if (acceptedFiles.length === 1) {
                const file = acceptedFiles[0];
                file.preview = URL.createObjectURL(file);
                setFiles(file.preview);
                setNewFiles(file)
                file.key = new Date().getTime();
            }
        },
        [pushMessageToSnackbar]
    );
    const result = useCallback(() => {
        axios({
            method: 'get',
            withCredentials: true,
            url: "http://localhost:4242/blog/posts/details/" + props.match.params.id
        }).then(res => {
            const article = res.data.articles;
            axios.get('http://localhost:4242/blog/posts/' + user.username)
                .then(r => {
                    const found = r.data.articles.find(element => element._id === props.match.params.id) === undefined;
                    if(found){
                        history.push('/user/blog/posts')
                    }
                })
            setArticle(article);
            setFiles('/uploads/' + article.article__image);
            setContent(article.article__content);
            setTitle(article.article__title);
            blogTitle.current.value = article.article__title;
        }).catch(error => {
            console.log(error);
        })
    }, [setArticle, setContent, setTitle])

    const closeDialog = useCallback(() => {
        setOnClose("toto");
    }, [setOnClose]);

    useEffect(() => {
        result();
    }, []);

    const removeFiles = () => {
        setFiles(null);
    }

    const printFile = useCallback(() => {
        if (files !== null) {
            return (
                <div className={classes.imgWrapper}>
                    <img
                        alt="uploaded item"
                        src={files}
                        className={classes.img}
                        style={{height: 148}}
                    />
                    <div className={classes.floatButtonWrapper}>
                        <IconButton onClick={removeFiles}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                </div>
            );
        }
        return (
            <Dropzone accept="image/png, image/jpeg" onDrop={onDrop} fullHeight>
        <span className={classes.uploadText}>
          Click / Drop file <br/> here
        </span>
            </Dropzone>
        );
    }, [onDrop, classes, files]);
    const getContentLength = useCallback(() => {
        setContentValue(document.querySelector('#article__content textarea').value.length);
    }, [setContentValue])

    const user = JSON.parse(localStorage.getItem('user'));
    /*Put Method*/
    const handlePut = useCallback(() => {
        setStatus(null);
        /*Image Upload*/
        const formData = new FormData();
        formData.append('file', newFiles);
        formData.append("article__title", blogTitle.current.value);
        formData.append("article__content", document.querySelector('#article__content textarea').value);
        formData.append("article__idUser", user._id);
        formData.append("article__username", user.username);
        axios.put(`http://localhost:4242/blog/posts/` + user.username + '/' + article._id, formData)
            .then(res => { // then print response status
                setIsLoading(true);
                setTimeout(() => {
                    pushMessageToSnackbar({
                        text: "Your articles has been uploaded",
                    });
                    setIsLoading(false);
                }, 1500);
            })
            .catch(error => {
                const response = error.response.data.error[0];
                const Errormessage = response.msg;
                const ErrorInput = response.param;
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
                pushMessageToSnackbar({
                    text: Errormessage,
                });
                setStatus({param: ErrorInput, message: Errormessage});
            })
    }, [setIsLoading, onClose, pushMessageToSnackbar, files, newFiles]);

    const goBack = () => {
        history.push('/user/blog/posts')
    }

    return (<>
        <Paper elevation={3} className={classes.card}>
            <Typography variant="h4" gutterBottom>
                Edit your article
            </Typography>
            <form noValidate autoComplete="off">
                <Box mb={2} id='article__content'>
                    <TextField
                        inputRef={blogTitle}
                        name="article__title"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label={'Title'}
                        autoFocus
                        autoComplete="off"
                        type="text"
                        error={status !== null && status.param === "article__title"}
                        helperText={(() => {
                            if (status !== null && status.param === "article__title") {
                                return status.message;
                            }
                            return null;
                        })()}
                        FormHelperTextProps={{error: true}}
                    />
                </Box>
                <Box mb={2} id='article__content'>
                    {EmojiTextArea && (
                        <EmojiTextArea
                            defaultValue={content}
                            maxCharacters={3500}
                            emojiSet="google"
                            rightContent={printFile()}
                            onChange={getContentLength}
                        />
                    )}
                </Box>
                <Fragment>
                    <div className={classes.right}>
                        <Box mr={1}>
                            <Button onClick={goBack} disabled={isLoading}>
                                Back
                            </Button>
                        </Box>
                        <Button
                            onClick={handlePut}
                            variant="contained"
                            color="secondary"
                            disabled={files === null || contentValue === 0 || isLoading}
                        >
                            Upload {isLoading && <ButtonCircularProgress/>}
                        </Button>
                    </div>
                </Fragment>
            </form>
        </Paper>
    </>);
}

UpdateArticle.propTypes = {
    pushMessageToSnackbar: PropTypes.func,
    selectUpdateArticle: PropTypes.func.isRequired,
};
export default withStyles(styles, {withTheme: true})(UpdateArticle);
