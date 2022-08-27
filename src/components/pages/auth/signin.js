import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import SignUpForm from './signup';
import ForgotForm from './forgot';
import AuthService from "../../../services/auth";
import GlobalContext from '../../../context/global-context'
import { useSnackbar } from 'notistack';
import Password from "../../atoms/password";
import FormDialog from "../../../templates/dialog/form";
import { useForm } from "react-hook-form";
import useConfirm from '../../../hooks/useConfirm'

const SignInButton = withStyles((theme) => ({
    root: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);

const SigninForm = ({ open, handleClose }) => {
    const confirm = useConfirm();
    const context = React.useContext(GlobalContext);

    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, setValue, errors, clearErrors } = useForm();
    React.useEffect(() => register("password", { required: true, minLength: 10 }), [register]) // for password

    const doHandleClose = () => {
        clearErrors()
        handleClose()
    };

    const doSubmit = async data => {
        context.startProcess()
        const response = await AuthService.signIn(data.username, data.password)
            .finally(() => context.endProcess())
        if (response && response.errorMessage) {
            await confirm({ alert: true, description: response.errorMessage })
            return
        }
        context.updateState({
            signedIn: true,
            session: {
                username: response.user.username
            }
        })
        enqueueSnackbar('ログインしました', { variant: 'success' })
        handleClose()
    };

    // for forgot password
    const [openForgot, setOpenForgot] = React.useState(false)

    const handleClickOpenForgot = () => {
        setOpenForgot(true);
    };

    const handleCloseForgot = () => {
        setOpenForgot(false);
    };

    // for sign up
    const [openSignup, setOpenSignup] = React.useState(false);

    const handleClickOpenSignup = () => {
        setOpenSignup(true);
    };

    const handleCloseSignup = () => {
        setOpenSignup(false);
    };

    const formContext = {
        title: "Sign in",
        fields: (
            <>
                <Grid item xs={12}>
                    <TextField
                        id="username"
                        name="username"
                        label="Username"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.username)}
                        helperText={errors.username && "入力してください"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Password
                        id="password"
                        name="password"
                        label="Password"
                        onChange={e => setValue("password", e.target.value)}
                        error={Boolean(errors.password)}
                        helperText={errors.password && (errors.password?.type === "required" ? "入力してください" : "10文字以上で入力してください")}
                    />
                </Grid>
            </>
        ),
        submitContext: {
            text: 'サインイン',
            handleSubmit: handleSubmit(doSubmit),
            aditional: (
                <>
                    {!process.env.GATSBY_DISABLE_SIGN_UP && (
                        <>
                            <Box display="flex" justifyContent="center" mb="1rem">
                                <Button onClick={handleClickOpenForgot} color="primary">
                                    アカウントを忘れた場合
                                </Button>
                            </Box>
                            <Box display="flex" justifyContent="center" mb="1rem">
                                <SignInButton variant="contained" color="primary" onClick={handleClickOpenSignup}>
                                    新しいアカウントを作成
                                </SignInButton>
                            </Box>
                        </>)
                    }
                </>
            )
        }
    };

    return (
        <>
            <ForgotForm open={openForgot} handleClose={handleCloseForgot} />
            <SignUpForm open={openSignup} handleClose={handleCloseSignup} />
            <FormDialog
                open={open}
                handleClose={doHandleClose}
                title={formContext.title}
                fields={formContext.fields}
                submitContext={formContext.submitContext}
            />
        </>
    )
}

export default SigninForm