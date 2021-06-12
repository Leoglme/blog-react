import React, {useState, useCallback, useRef, Fragment} from "react";
import PropTypes from "prop-types";
import {
    FormHelperText,
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
import {Redirect, withRouter} from "react-router";

const styles = (theme) => ({
    link: {
        transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut,
        }),
        cursor: "pointer",
        color: theme.palette.primary.main,
        "&:enabled:hover": {
            color: theme.palette.primary.dark,
        },
        "&:enabled:focus": {
            color: theme.palette.primary.dark,
        },
    },
});

function RegisterDialog(props) {
    const {setStatus, theme, onClose, openTermsDialog, status, classes, history} = props;
    const [isLoading, setIsLoading] = useState(false);
    const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const registerTermsCheckbox = useRef();
    const registerPassword = useRef();
    const registerPasswordRepeat = useRef();
    const registerEmail = useRef();
    const registerUsername = useRef();
    const registerName = useRef();

    async function registerUser(credentials) {
        if (!registerTermsCheckbox.current.checked) {
            setHasTermsOfServiceError(true);
            return;
        }
        return fetch('http://localhost:4242/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(data => data.json())
            .catch(error => () => {
                console.log("catchError err");
            })
    }

    function statusError(response) {
        setStatus(null);
        const isSuccess = response === undefined ? true : response.success;
        if (!isSuccess) {
            const Errormessage = response.error[0].msg;
            const ErrorInput = response.error[0].param;
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
            setStatus({param: ErrorInput, message: Errormessage});
            return;
        }
        if (!registerTermsCheckbox.current.checked) {
            setHasTermsOfServiceError(true);
        }else{
            const user = response.user;
            localStorage.clear();
            localStorage.setItem('token', user._id)
            localStorage.setItem('user', JSON.stringify(user))
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                history.push("/user/blog")
            }, 150);
        }
    }

    return (
        <FormDialog
            loading={isLoading}
            onClose={onClose}
            open
            headline="Register"
            onFormSubmit={(e) => {
                e.preventDefault();
                registerUser({
                    name: registerName.current.value,
                    username: registerUsername.current.value,
                    email: registerEmail.current.value,
                    password: registerPasswordRepeat.current.value,
                    password2: registerPassword.current.value
                }).then(r => statusError(r));
            }}
            hideBackdrop
            hasCloseIcon
            content={
                <Fragment>
                    <TextField
                        inputRef={registerName}
                        name="name"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        autoFocus
                        autoComplete="off"
                        type="text"
                        error={status !== null && status.param === "name"}
                        helperText={(() => {
                            if (status !== null && status.param === "name") {
                                return status.message;
                            }
                            return null;
                        })()}
                        FormHelperTextProps={{error: true}}
                    />
                    <TextField
                        inputRef={registerEmail}
                        name="email"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoFocus
                        autoComplete="off"
                        type="email"
                        error={status !== null && status.param === "email"}
                        helperText={(() => {
                            if (status !== null && status.param === "email") {
                                return status.message;
                            }
                            return null;
                        })()}
                        FormHelperTextProps={{error: true}}
                    />
                    <TextField
                        inputRef={registerUsername}
                        name="username"
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        autoComplete="off"
                        type="text"
                        error={status !== null && status.param === "username"}
                        helperText={(() => {
                            if (status !== null && status.param === "username") {
                                return status.message;
                            }
                            return null;
                        })()}
                        FormHelperTextProps={{error: true}}
                    />
                    <VisibilityPasswordTextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        inputRef={registerPassword}
                        name="password"
                        autoComplete="off"
                        error={status !== null && status.param === "password"}
                        helperText={(() => {
                            if (status !== null && status.param === "password") {
                                return status.message;
                            }
                            return null;
                        })()}
                        FormHelperTextProps={{error: true}}
                        isVisible={isPasswordVisible}
                        onVisibilityChange={setIsPasswordVisible}
                    />
                    <VisibilityPasswordTextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Repeat Password"
                        inputRef={registerPasswordRepeat}
                        name="password2"
                        autoComplete="off"
                        error={status !== null && status.param === "password2"}
                        helperText={(() => {
                            if (status !== null && status.param === "password2") {
                                return status.message;
                            }
                            return null;
                        })()}
                        FormHelperTextProps={{error: true}}
                        isVisible={isPasswordVisible}
                        onVisibilityChange={setIsPasswordVisible}
                    />
                    <FormControlLabel
                        style={{marginRight: 0}}
                        control={
                            <Checkbox
                                color="primary"
                                inputRef={registerTermsCheckbox}
                                onChange={() => {
                                    setHasTermsOfServiceError(false);
                                }}
                            />
                        }
                        label={
                            <Typography variant="body1">
                                I agree to the
                                <span
                                    className={classes.link}
                                    onClick={isLoading ? null : openTermsDialog}
                                    tabIndex={0}
                                    role="button"
                                    onKeyDown={(event) => {
                                        // For screenreaders listen to space and enter events
                                        if (
                                            (!isLoading && event.keyCode === 13) ||
                                            event.keyCode === 32
                                        ) {
                                            openTermsDialog();
                                        }
                                    }}
                                >
                  {" "}
                                    terms of service
                </span>
                            </Typography>
                        }
                    />
                    {hasTermsOfServiceError && (
                        <FormHelperText
                            error
                            style={{
                                display: "block",
                                marginTop: theme.spacing(-1),
                            }}
                        >
                            In order to create an account, you have to accept our terms of
                            service.
                        </FormHelperText>
                    )}
                </Fragment>
            }
            actions={
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    color="secondary"
                    disabled={isLoading}
                >
                    Register
                    {isLoading && <ButtonCircularProgress/>}
                </Button>
            }
        />
    );
}

RegisterDialog.propTypes = {
    theme: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    openTermsDialog: PropTypes.func.isRequired,
    status: PropTypes.object,
    setStatus: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, {withTheme: true})(RegisterDialog));
