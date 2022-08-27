import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AuthService from "../../../services/auth";
import { useSnackbar } from 'notistack';
import FormDialog from "../../../templates/dialog/form";
import { useForm } from "react-hook-form";
import useConfirm from '../../../hooks/useConfirm'

const ConfirmForm = ({ username, open, handleClose }) => {
    const confirm = useConfirm();

    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit, errors } = useForm();

    const resendCode = async () => {
        const response = await AuthService.resendConfirmationCode(username)
        if (response && response.errorMessage) {
            await confirm({ alert: true, description: response.errorMessage })
            return
        }
        enqueueSnackbar('登録メールアドレスに確認コードを再送しました', { variant: 'success' })
    };

    const doSubmit = async data => {
        const response = await AuthService.confirmSignUp(username, data.code)
        if (response && response.errorMessage) {
            await confirm({ alert: true, description: response.errorMessage })
            return
        }
        enqueueSnackbar('アカウント作成が完了しました', { variant: 'success' })
        handleClose()
    };

    const formContext = {
        title: "Confirm Sign up",
        fields: (
            <>
                <Grid item xs={12}>
                    <TextField
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
                        id="code"
                        name="code"
                        label="Code"
                        placeholder="Enter your code"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.code)}
                        helperText={errors.code && "入力してください"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                        <Button onClick={resendCode} color="primary">
                            確認コードの再送
                        </Button>
                    </Box>
                </Grid>
            </>
        ),
        submitContext: {
            text: '確認',
            handleSubmit: handleSubmit(doSubmit),
        }
    };

    return (
        <FormDialog
            open={open}
            handleClose={handleClose}
            title={formContext.title}
            fields={formContext.fields}
            submitContext={formContext.submitContext}
        />
    );
}

export default ConfirmForm