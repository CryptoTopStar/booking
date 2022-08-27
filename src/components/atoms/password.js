import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const PasswordFormField = ({ id, name, label, autoComplete, helperText, onChange, error }) => {
    const [values, setValues] = React.useState({
        value: '',
        showPassword: false,
    })

    const handleChange = (event) => {
        setValues({ ...values, value: event.target.value });
        onChange(event)
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <FormControl error={error} fullWidth>
            <InputLabel htmlFor="standard-adornment-password">{label}</InputLabel>
            <Input
                id={id}
                name={name}
                type={values.showPassword ? 'text' : 'password'}
                autoComplete={autoComplete}
                value={values.value}
                onChange={handleChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {!!helperText &&
                (<FormHelperText>{helperText}</FormHelperText>)
            }
        </FormControl>
    )
}

export default PasswordFormField