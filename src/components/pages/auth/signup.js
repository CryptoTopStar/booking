import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import ConfirmForm from './confirm';
import AuthService from "../../../services/auth";
import Password from "../../atoms/password";
import FormDialog from "../../../templates/dialog/form";
import { useForm } from "react-hook-form";
import useConfirm from '../../../hooks/useConfirm'

const SignUpForm = ({ open, handleClose }) => {
    const confirm = useConfirm();
    const [userName, setUserName] = React.useState('');

    const { register, handleSubmit, setValue, errors, clearErrors } = useForm();
    React.useEffect(() => register("password", { required: true, minLength: 10 }), [register]) // for password

    const doHandleClose = () => {
        clearErrors()
        handleClose()
    };

    const doSubmit = async data => {
        const response = await AuthService.signUp(data.username, data.password, data.email, data.tel)
        if (response && response.errorMessage) {
            await confirm({ alert: true, description: response.errorMessage })
            return
        }
        setUserName(data.username)
        handleClose()
        handleClickOpenConfirm()
    };

    const getPassWordHelperText = errors => {
        if (!errors.password || errors.password.type !== "required")
            return "アルファベット（大文字小文字混在）と数字と特殊記号を組み合わせて10文字以上で入力してください。"
        else
            return "入力してください"
    }

    // for confirm code
    const [openConfirm, setOpenConfirm] = React.useState(false);

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const formContext = {
        title: "Sign up",
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
                        helperText={getPassWordHelperText(errors)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        inputRef={register({ required: true })}
                        error={Boolean(errors.email)}
                        helperText={errors.email && "入力してください"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="tel"
                        name="tel"
                        label="Tel"
                        fullWidth
                        inputRef={register}
                    />
                </Grid>
            </>
        ),
        submitContext: {
            text: 'サインアップ',
            handleSubmit: handleSubmit(doSubmit),
        }
    };

    return (
        <>
            <ConfirmForm username={userName} open={openConfirm} handleClose={handleCloseConfirm} />
            <FormDialog
                open={open}
                handleClose={doHandleClose}
                title={formContext.title}
                fields={formContext.fields}
                submitContext={formContext.submitContext}
            />
        </>
    );
}

export default SignUpForm