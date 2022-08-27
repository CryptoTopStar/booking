import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation } from 'aws-amplify';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useForm } from "react-hook-form";
import { useSnackbar } from 'notistack';
import FormDialog from "./form"
import GlobalContext from '../../context/global-context'
import { createInquiry } from '../../graphql/mutations'

const InquiryDialog = ({ open, handleClose }) => {
    const context = React.useContext(GlobalContext);
    const { enqueueSnackbar } = useSnackbar();

    const { register, handleSubmit, errors, clearErrors } = useForm();

    const doSubmit = async data => {
        context.startProcess()
        await API.graphql(graphqlOperation(createInquiry, {
            input: {
                id: uuidv4(),
                ...data
            }
        })).finally(() => context.endProcess())

        enqueueSnackbar('お問い合わせを受け付けました', { variant: 'success' })
        doHandleClose()
    };

    const doHandleClose = () => {
        clearErrors()
        handleClose()
    };

    const formContext = {
        title: "お問い合わせ",
        fields: (
            <GlobalContext.Consumer>
                {context => (
                    <>
                        <Grid item xs={12} md={12}>
                            <TextField
                                required
                                id="name"
                                name="name"
                                label="Name"
                                defaultValue={context.state?.session.username}
                                fullWidth
                                inputRef={register({ required: true })}
                                error={Boolean(errors.name)}
                                helperText={errors.name && "入力してください"}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                required
                                id="email"
                                name="email"
                                label="Email"
                                fullWidth
                                inputRef={register({
                                    required: true,
                                    pattern: {
                                        value: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line
                                    }
                                })}
                                error={Boolean(errors.email)}
                                helperText={errors.email && "メールアドレスを入力してください"}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                id="title"
                                name="title"
                                label="Title"
                                fullWidth
                                inputRef={register}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                required
                                id="text"
                                name="text"
                                label="text"
                                fullWidth
                                multiline
                                rows={10}
                                inputRef={register({ required: true })}
                                error={Boolean(errors.text)}
                                helperText={errors.text && "入力してください"}
                            />
                        </Grid>
                    </>
                )}
            </GlobalContext.Consumer>
        ),
        submitContext: {
            text: '送信',
            handleSubmit: handleSubmit(doSubmit)
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

export default InquiryDialog