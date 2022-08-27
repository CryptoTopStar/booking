import { useState, useEffect } from 'react';
import _ from 'lodash'

const titleMapping = [
    { pathname: "/about", title: 'About' },
    { pathname: "/error", title: 'Error' },
    { pathname: "/404", title: 'Not Found' },
    { pathname: "/", title: 'Top' },
]

const useDocumentTitle = (location) => {
    const [title, setTitle] = useState('Top');

    useEffect(() => {
        const pathname = location.pathname;
        const title = _.head(titleMapping.filter(mapping => _.startsWith(pathname, mapping.pathname)))?.title
        setTitle(`${process.env.GATSBY_SALON_NAME} | ${title}`)
    }, [location]);

    return title
}

export default useDocumentTitle