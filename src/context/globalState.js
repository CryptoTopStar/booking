import React, { lazy, Suspense } from 'react'
import _ from 'lodash'
import GlobalContext from './global-context';
import AuthService from "../services/auth";

const Progress = lazy(() => import('../components/Progress'));

// Global State Settings
const initialState = {
    signedIn: false,
    processing: false,
    session: {}
};

const initState = () => {
    let state = _.attempt(JSON.parse.bind(null, localStorage.getItem('state')));
    console.log(state)
    if (_.isError(state) || !state) {
        state = {
            ...{},
            ...initialState
        };
    }
    return {
        ...state,
        processing: false,
    }
}

const GlobalStateProvider = ({ children }) => {
    const [state, setState] = React.useState(initState);

    const updateState = value => {
        setState({ ...state, ...value })
    };

    const startProcess = () => {
        setState({ ...state, processing: true })
    };

    const endProcess = () => {
        setState({ ...state, processing: false })
    };

    const global = {
        state,
        updateState,
        startProcess,
        endProcess,
    }

    React.useEffect(() => {
        async function checkLogin() {
            await AuthService.getUser()
                .then(user => {
                    setState(prevState => ({
                        ...prevState,
                        signedIn: true,
                        session: {
                            username: user.username,
                            sub: user.attributes.sub
                        }
                    }))
                })
                .catch(() => {
                    setState({
                        ...{},
                        ...initialState
                    })
                })
        }
        checkLogin()
    }, []);

    React.useEffect(() => {
        localStorage.setItem("state", JSON.stringify(state))
    }, [state]);

    return (
        <GlobalContext.Provider
            value={global}
        >
            {/*  processing start */}
            <Suspense fallback={<></>}>
                <Progress processing={state.processing} />
            </Suspense>
            {/*  processing end */}
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalStateProvider, initialState }