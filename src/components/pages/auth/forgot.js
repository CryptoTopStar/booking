import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SubmitForm from './forgotPasswordSubmit';
import AuthService from "../../../services/auth";
import { useSnackbar } from 'notistack';
import FormDialog from "../../../templates/dialog/form";
import { useForm } from "react-hook-form";
import useConfirm from '../../../hooks/useConfirm'

const ForgotForm = ({ open, handleClose }) => {
    const confirm = useConfirm();

    const { enqueueSnackbar } = useSnackbar();
    const { register, handleSubmit } = useForm();
    const [userName, setUserName] = React.useState('');

    const doSubmit = async data => {
        const response = await AuthService.forgotPassword(data.username)
        if (response && response.errorMessage) {
            await confirm({ alert: true, description: response.errorMessage })
            return
        }
        enqueueSnackbar('登録メールアドレスに確認コードを送信しました', { variant: 'success' })
        handleClose()
        setUserName(data.username)
        handleClickOpenSubmit()
    };

    // for submit
    const [openSubmit, setOpenSubmit] = React.useState(false);

    const handleClickOpenSubmit = () => {
        setOpenSubmit(true);
    };

    const handleCloseSubmit = () => {
        setOpenSubmit(false);
    };

    const formContext = {
        title: "Forgot your password?",
        fields: (
            <>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="username"
                        name="username"
                        label="Username"
                        fullWidth
                        autoComplete="signin username"
                        inputRef={register}
                    />
                </Grid>
            </>
        ),
        submitContext: {
            text: 'パスワードリセット',
            handleSubmit: handleSubmit(doSubmit),
        }
    };

    return (
        <>
            <SubmitForm username={userName} open={openSubmit} handleClose={handleCloseSubmit} />
            <FormDialog
                open={open}
                handleClose={handleClose}
                title={formContext.title}
                fields={formContext.fields}
                submitContext={formContext.submitContext}
            />
        </>
    );
}

export default ForgotForm