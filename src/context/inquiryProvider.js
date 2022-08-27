import React, { useState, lazy, Suspense } from 'react';
import InquiryContext from './inquiryContext';

const InquiryForm = lazy(() => import('../templates/dialog/inquiry'));

const InquiryProvider = ({ children }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const global = {
        handleOpen,
        handleClose
    }

    return (
        <>
            <InquiryContext.Provider value={global}>
                {children}
            </InquiryContext.Provider>
            <Suspense fallback={<></>}>
                <InquiryForm
                    open={open}
                    handleClose={handleClose}
                />
            </Suspense>
        </>
    );
};

export default InquiryProvider;