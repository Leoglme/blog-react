import React, {useState, useCallback} from "react";
import PropTypes from "prop-types";
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from 'react-router-dom';
import {
    Grid,
    TablePagination,
    Divider,
    Toolbar,
    Typography,
    Button,
    Paper,
    Box,
    withStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import axios from "axios";

const styles = {
    dBlock: {display: "block"},
    dNone: {display: "none"},
    toolbar: {
        justifyContent: "space-between",
    },
};

const rowsPerPage = 25;

function PostContent(props) {
    const {
        pushMessageToSnackbar,
        setPosts,
        posts,
        openAddPostModal,
        classes
    } = props;
    const [page, setPage] = useState(0);
    const [currentId, setCurrentId] = useState({});
    const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
    const [isDeletePostDialogLoading, setIsDeletePostDialogLoading] = useState(
        false
    );

    const closeDeletePostDialog = useCallback(() => {
        setIsDeletePostDialogOpen(false);
        setIsDeletePostDialogLoading(false);
    }, [setIsDeletePostDialogOpen, setIsDeletePostDialogLoading]);

    const deletePost = useCallback(() => {
        const currentId = document.querySelector("[data-annonce]").getAttribute('data-annonce');
        console.log(document.querySelector("[data-annonce]"));
        setIsDeletePostDialogLoading(true);
        setTimeout(() => {
            let _posts = [...posts];
            const index = _posts.find((element) => element.id === currentId);
            _posts = _posts.filter(function (obj) {
                return obj !== index;
            });
            axios.delete('http://localhost:4242/blog/posts/admin/' + currentId,)
                .then(r => console.log(r))
                .catch(error => console.log(error))
            setPosts(_posts);
            pushMessageToSnackbar({
                text: "Your post has been deleted",
            });
            closeDeletePostDialog();
        }, 1500);
    }, [
        posts,
        setPosts,
        setIsDeletePostDialogLoading,
        pushMessageToSnackbar,
        closeDeletePostDialog,
    ]);

    const onDelete = useCallback((id) => {
        const allPosts = document.querySelectorAll("[data-annonce]");
        for (let i = 0; i < allPosts.length; i++) {
            allPosts[i].setAttribute('data-annonce', id);
        }
        setIsDeletePostDialogOpen(true);
    }, [setIsDeletePostDialogOpen]);

    const handleChangePage = useCallback(
        (__, page) => {
            setPage(page);
        },
        [setPage]
    );
    const user = JSON.parse(localStorage.getItem('user'));
    const history = useHistory();
    const handleOnClick = useCallback((id) => {
        const allPosts = document.querySelectorAll("[data-edit-annonce]");
        for (let i = 0; i < allPosts.length; i++) {
            allPosts[i].setAttribute('data-edit-annonce', id);
        }
        const currentId = document.querySelector("[data-edit-annonce]").getAttribute('data-edit-annonce');
        history.push('/user/blog/post/edit/' + currentId)
    }, [history]);
    const printImageGrid = useCallback(() => {
        if (posts.length > 0) {
            return (
                <Box p={1}>
                    <Grid container spacing={1}>
                        {posts
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((post) => (
                                <Grid item xs={6} sm={4} md={3} key={post.id}>
                                    <SelfAligningImage
                                        id_annonce={post.id}
                                        src={post.src}
                                        title={post.name}
                                        timeStamp={post.timestamp}
                                        options={[
                                            {
                                                name: "Delete",
                                                onClick: () => {
                                                    onDelete(post.id);
                                                },
                                                icon: <DeleteIcon/>,
                                            },
                                            {
                                                name: "Edit",
                                                onClick: () => {
                                                    handleOnClick(post.id);
                                                },
                                                icon: <EditIcon/>,
                                            },
                                        ]}
                                    />
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            );
        }
        return (
            <Box m={2}>
                <HighlightedInformation>
                    No posts added yet. Click on &quot;NEW&quot; to create your first one.
                </HighlightedInformation>
            </Box>
        );
    }, [posts, onDelete, page]);

    return (
        <Paper>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6">Your Posts</Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={openAddPostModal}
                    disableElevation
                >
                    Add Post
                </Button>
            </Toolbar>
            <Divider/>
            {printImageGrid()}
            <TablePagination
                component="div"
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                    "aria-label": "Previous Page",
                }}
                nextIconButtonProps={{
                    "aria-label": "Next Page",
                }}
                onChangePage={handleChangePage}
                classes={{
                    select: classes.dNone,
                    selectIcon: classes.dNone,
                    actions: posts.length > 0 ? classes.dBlock : classes.dNone,
                    caption: posts.length > 0 ? classes.dBlock : classes.dNone,
                }}
                labelRowsPerPage=""
            />
            <ConfirmationDialog
                open={isDeletePostDialogOpen}
                title="Confirmation"
                content="Do you really want to delete the post?"
                onClose={closeDeletePostDialog}
                loading={isDeletePostDialogLoading}
                onConfirm={deletePost}
            />
        </Paper>
    );
}

PostContent.propTypes = {
    openAddPostModal: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    setPosts: PropTypes.func.isRequired,
    pushMessageToSnackbar: PropTypes.func,
};

export default withStyles(styles)(PostContent);
