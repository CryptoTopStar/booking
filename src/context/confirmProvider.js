import React, { useState, useCallback, lazy, Suspense } from 'react';
import ConfirmContext from './confirmContext';

const ConfirmationDialog = lazy(() => import('../templates/dialog/confirm'));

const DEFAULT_OPTIONS = {
    html: false,
    alert: false,
    title: '',
    description: '',
    confirmationText: 'Ok',
    cancellationText: 'Cancel',
    dialogProps: {},
    confirmationButtonProps: {},
    cancellationButtonProps: {},
};

const buildOptions = (defaultOptions, options) => {
    const dialogProps = {
        ...(defaultOptions.dialogProps || DEFAULT_OPTIONS.dialogProps),
        ...(options.dialogProps || {}),
    };
    const confirmationButtonProps = {
        ...(defaultOptions.confirmationButtonProps || DEFAULT_OPTIONS.confirmationButtonProps),
        ...(options.confirmationButtonProps || {}),
    };
    const cancellationButtonProps = {
        ...(defaultOptions.cancellationButtonProps || DEFAULT_OPTIONS.cancellationButtonProps),
        ...(options.cancellationButtonProps || {}),
    };

    return {
        ...DEFAULT_OPTIONS,
        ...defaultOptions,
        ...options,
        dialogProps,
        confirmationButtonProps,
        cancellationButtonProps,
    }
};

const ConfirmProvider = ({ children, defaultOptions = {} }) => {
    const [options, setOptions] = useState({ ...DEFAULT_OPTIONS, ...defaultOptions });
    const [resolveReject, setResolveReject] = useState([]);
    const [resolve, reject] = resolveReject;

    const confirm = useCallback((options = {}) => {
        return new Promise((resolve, reject) => {
            setOptions(buildOptions(defaultOptions, options));
            setResolveReject([resolve, reject]);
        });
    }, [defaultOptions]);

    const handleClose = useCallback(() => {
        setResolveReject([]);
    }, []);

    const handleCancel = useCallback(() => {
        reject();
        handleClose();
    }, [reject, handleClose]);

    const handleConfirm = useCallback(() => {
        resolve();
        handleClose();
    }, [resolve, handleClose]);

    return (
        <>
            <ConfirmContext.Provider value={confirm}>
                {children}
            </ConfirmContext.Provider>
            <Suspense fallback={<></>}>
                <ConfirmationDialog
                    open={resolveReject.length === 2}
                    options={options}
                    onClose={handleClose}
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                />
            </Suspense>
        </>
    );
};

export default ConfirmProvider;