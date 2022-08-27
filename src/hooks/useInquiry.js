import { useContext } from 'react';
import InquiryContext from '../context/inquiryContext';

const useInquiry = () => {
    const inquiry = useContext(InquiryContext);
    return inquiry;
};

export default useInquiry;