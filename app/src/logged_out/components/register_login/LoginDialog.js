import React, {useState, useCallback, useRef, Fragment} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {withRouter} from "react-router-dom";
import {
    TextField,
    Button,
    Checkbox,
    Typography,
    FormControlLabel,
    withStyles,
} from "@material-ui/core";
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import VisibilityPasswordTextField from "../../../shared/components/VisibilityPasswordTextField";
import axios from "axios";

const styles = (theme) => ({
    forgotPassword: {
        marginTop: theme.spacing(2),
        color: theme.palette.primary.main,
        cursor: "pointer",
        "&:enabled:hover": {
            color: theme.palette.primary.dark,
        },
        "&:enabled:focus": {
            color: theme.palette.primary.dark,
        },
    },
    disabledText: {
        cursor: "auto",
        color: theme.palette.text.disabled,
    },
    formControlLabel: {
        marginRight: 0,
    },
});

function LoginDialog(props) {
    const {
        setStatus,
        history,
        classes,
        onClose,
        openChangePasswordDialog,
        status,
    } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const loginUsername = useRef();
    const loginPassword = useRef();
    const loginUser = () => {
        axios({
            method: 'post',
            data: {
                username: loginUsername.current.value,
                password: loginPassword.current.value
            },
            withCredentials: true,
            url: "http://localhost:4242/users/login"
        }).then(res => {
            console.log(res);
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                connectUser();
            }, 1500);
        }).catch(error => {
            const ErrorStatus = error.response.data.success;
            const Errormessage = error.response.data.message;
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
            setStatus({param: 'invalidPassword', message: Errormessage});
            console.log(error.response);
        })
    };
    const connectUser = () => {
        axios({
            method: 'get',
            withCredentials: true,
            url: "http://localhost:4242/user/details"
        }).then(res => {
            const user = res.data.user;
            localStorage.setItem('token', user._id)
            localStorage.setItem('user', JSON.stringify(user))
            console.log('user', user) // undefined
            history.push("/user/blog")
        }).catch(error => {
            console.log(error);
        })
    };


    return (
        <Fragment>
            <FormDialog
                open
                onClose={onClose}
                loading={isLoading}
                onFormSubmit={(e) => {
                    e.preventDefault();
                    loginUser();
                }}
                hideBackdrop
                headline="Login"
                content={
                    <Fragment>
                        <TextField
                            inputRef={loginUsername}
                            name="username"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoFocus
                            autoComplete="off"
                            type="text"
                            error={status !== null && status.param === "invalidPassword"}
                            helperText={(() => {
                                if (status !== null && status.param === "invalidPassword") {
                                    return status.message;
                                }
                                return null;
                            })()}
                            FormHelperTextProps={{error: true}}
                        />
                        <VisibilityPasswordTextField
                            name="password"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            inputRef={loginPassword}
                            autoComplete="off"
                            error={status !== null && status.param === "invalidPassword"}
                            helperText={(() => {
                                if (status !== null && status.param === "invalidPassword") {
                                    return status.message;
                                }
                                return null;
                            })()}
                            FormHelperTextProps={{error: true}}
                            onVisibilityChange={setIsPasswordVisible}
                            isVisible={isPasswordVisible}
                        />
                        <FormControlLabel
                            className={classes.formControlLabel}
                            control={<Checkbox color="primary"/>}
                            label={<Typography variant="body1">Remember me</Typography>}
                        />
                    </Fragment>
                }
                actions={
                    <Fragment>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            disabled={isLoading}
                            size="large"
                        >
                            Login
                            {isLoading && <ButtonCircularProgress/>}
                        </Button>
                        <Typography
                            align="center"
                            className={classNames(
                                classes.forgotPassword,
                                isLoading ? classes.disabledText : null
                            )}
                            color="primary"
                            onClick={isLoading ? null : openChangePasswordDialog}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(event) => {
                                // For screenreaders listen to space and enter events
                                if (
                                    (!isLoading && event.keyCode === 13) ||
                                    event.keyCode === 32
                                ) {
                                    openChangePasswordDialog();
                                }
                            }}
                        >
                            Forgot Password?
                        </Typography>
                    </Fragment>
                }
            />
        </Fragment>
    );
}

LoginDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    openChangePasswordDialog: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    status: PropTypes.string,
};

export default withRouter(withStyles(styles)(LoginDialog));
