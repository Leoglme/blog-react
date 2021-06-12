import React, {Fragment, useState, useCallback, useRef, useEffect} from "react";
import PropTypes from "prop-types";
import {
    Button,
    Box,
    TextField,
    FormControl,
    InputLabel,
    makeStyles,
    withStyles,
    Select,
    MenuItem,
    Input, Chip, useTheme, InputBase
} from "@material-ui/core";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import AddPostOptions from "./AddPostOptions";
import axios from "axios";
import {logger} from "workbox-core/_private";
import {lightGreen} from "@material-ui/core/colors";
import theme from "../../../theme";

const useStyles = {
    formControl: {
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


function AddPost(props) {
    const {
        pushMessageToSnackbar,
        Dropzone,
        EmojiTextArea,
        DateTimePicker,
        ImageCropper,
        onClose,
        classes
    } = props;

    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uploadAt, setUploadAt] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [cropperFile, setCropperFile] = useState(null);
    const blogTitle = useRef();
    let newFile;

    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        setPersonName(event.target.value);
    };
    const acceptDrop = useCallback(
        (file) => {
            setFiles([file]);
        },
        [setFiles]
    );
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
                newFile = file;
                file.preview = URL.createObjectURL(file);
                file.key = new Date().getTime();
                setCropperFile(file);
            }
        },
        [pushMessageToSnackbar, setCropperFile]
    );

    const onCropperClose = useCallback(() => {
        setCropperFile(null);
    }, [setCropperFile]);

    const deleteItem = useCallback(() => {
        setCropperFile(null);
        setFiles([]);
    }, [setCropperFile, setFiles]);
    const onCrop = useCallback(
        (dataUrl) => {
            const file = {...cropperFile};
            file.preview = dataUrl;
            acceptDrop(file);
            setCropperFile(null);
        },
        [acceptDrop, cropperFile, setCropperFile]
    );
    const user = JSON.parse(localStorage.getItem('user'));

    const handleUpload = useCallback(() => {
        console.log(personName);
        setStatus(null);
        /*Image Upload*/
        const formData = new FormData();
        formData.append('file', newFile);
        formData.append("article__title", blogTitle.current.value);
        formData.append("article__content", document.querySelector('#article__content textarea').value);
        formData.append("article__idUser", user._id);
        formData.append("article__username", user.username);
        formData.append("article__category", personName);
        axios.post(`http://localhost:4242/blog/posts/${user.username}`, formData)
            .then(res => { // then print response status
                setLoading(true);
                setTimeout(() => {
                    pushMessageToSnackbar({
                        text: "Your articles has been uploaded",
                    });
                    onClose();
                }, 1500);
            })
            .catch(error => {
                console.log(error.response);
                const response = error.response.data.error === undefined ? undefined : error.response.data.error[0];
                if (response !== undefined){
                    const Errormessage = response.msg;
                    const ErrorInput = response.param;
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                    }, 1500);
                    setStatus({param: ErrorInput, message: Errormessage});
                }
            })
    }, [setLoading, onClose, pushMessageToSnackbar, personName]);

    const getCategories = useCallback(() => {
        axios.get('http://localhost:4242/blog/getCategories')
            .then(res => setCategories(res.data.categories))
            .catch(error => console.log(error))
    }, [setCategories])
    useEffect(() => {
        getCategories();
    }, [getCategories]);
    return (
        <Fragment>
            <ActionPaper
                helpPadding
                maxWidth="md"
                content={
                    <>
                        <AddPostOptions
                            EmojiTextArea={EmojiTextArea}
                            Dropzone={Dropzone}
                            files={files}
                            onDrop={onDrop}
                            deleteItem={deleteItem}
                            DateTimePicker={DateTimePicker}
                            uploadAt={uploadAt}
                            onChangeUploadAt={setUploadAt}
                            onCrop={onCrop}
                            ImageCropper={ImageCropper}
                            cropperFile={cropperFile}
                            onCropperClose={onCropperClose}
                        />
                        <TextField
                            inputRef={blogTitle}
                            name="article__title"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Title"
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
                        <FormControl className={classes.formControl} style={{width: '100%', maxWidth: 'unset'}}>
                            <InputLabel id="demo-mutiple-chip-label">Categories</InputLabel>
                            <Select
                                labelId="demo-mutiple-chip-label"
                                id="demo-mutiple-chip"
                                multiple
                                value={personName}
                                onChange={handleChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={(selected) => (
                                    <div className={classes.chips}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {categories.map((name, key) => (
                                    <MenuItem key={key} value={name.category_name} style={getStyles(name.category_name, personName, theme)}>
                                        {name.category_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                }
                actions={
                    <Fragment>
                        <Box mr={1}>
                            <Button onClick={onClose} disabled={loading}>
                                Back
                            </Button>
                        </Box>
                        <Button
                            onClick={handleUpload}
                            variant="contained"
                            color="secondary"
                            disabled={files.length === 0 || loading}
                        >
                            Upload {loading && <ButtonCircularProgress/>}
                        </Button>
                    </Fragment>
                }
            />
        </Fragment>
    );
}

AddPost.propTypes = {
    pushMessageToSnackbar: PropTypes.func,
    onClose: PropTypes.func,
    Dropzone: PropTypes.elementType,
    EmojiTextArea: PropTypes.elementType,
    DateTimePicker: PropTypes.elementType,
    ImageCropper: PropTypes.elementType,
};


export default withStyles(useStyles)(AddPost);
