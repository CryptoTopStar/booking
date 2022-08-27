import React from 'react';

import { initialState } from './globalState';

export default React.createContext({
    state: {
        ...{},
        ...initialState
    },
    updateState: value => { },
    startProcess: () => { },
    endProcess: () => { },
});
