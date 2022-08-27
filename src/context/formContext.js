import React from "react"
import _ from 'lodash'

import FormContext from './form-context';

const initState = () => {
    let state = _.attempt(JSON.parse.bind(null, localStorage.getItem('form')))
    if (_.isError(state) || !state) {
        state = {}
    }
    return state
}

export default ({ children }) => {
    const [form, setForm] = React.useState(initState);

    const updateForm = value => {
        console.log(value)
        setForm({ ...form, ...value })
    };

    React.useEffect(() => {
        localStorage.setItem("form", JSON.stringify(form));
    }, [form]);

    const value = {
        form,
        updateForm,
    }

    return (
        <FormContext.Provider
            value={value}
        >
            {children}
        </FormContext.Provider>
    );
}
