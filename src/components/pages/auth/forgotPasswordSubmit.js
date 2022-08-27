import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AuthService from "../../../services/auth";
import { useSnackbar } from 'notistack';
import Password from "../../atoms/password";
import FormDialog from "../../../templates/dialog/form";
import { useForm } from "react-hook-form";
import useConfirm from '../../../hooks/useConfirm'

const ForgotPasswordSubmitForm = ({ username, open, handleClose }) => {
    const confirm = useConfirm();

    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, setValue, clearErrors } = useForm();
    React.useEffect(() => {
        register("password")
        register("confirmPassword")
    }, [register]) // for password

    const doHandleClose = () => {
        clearErrors()
        handleClose()
    };

    const doSubmit = async data => {
        const response = await AuthService.forgotPasswordSubmit(username, data.code, data.password)
        if (response && response.errorMessage) {
            await confirm({ alert: true, description: response.errorMessage })
            return
        }
        enqueueSnackbar('パスワードを更新しました', { variant: 'success' })
        handleClose()
    };

    const formContext = {
        title: "forgot password submit",
        fields: (
            <>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="username"
                        name="username"
                        label="Username"
                        fullWidth
                        disabled
                        value={username}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="code"
                        name="code"
                        label="Code"
                        placeholder="Enter your code"
                        fullWidth
                        inputRef={register}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Password
                        id="password"
                        name="password"
                        label="Password"
                        onChange={e => setValue("password", e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Password
                        id="confirmPassword"
                        name="confirmPassword"
                        label="ConfirmPassword"
                        onChange={e => setValue("confirmPassword", e.target.value)}
                    />
                </Grid>
            </>
        ),
        submitContext: {
            text: '更新',
            handleSubmit: handleSubmit(doSubmit),
        }
    };

    return (
        <FormDialog
            open={open}
            handleClose={doHandleClose}
            title={formContext.title}
            fields={formContext.fields}
            submitContext={formContext.submitContext}
        />
    );
}

export default ForgotPasswordSubmitForm