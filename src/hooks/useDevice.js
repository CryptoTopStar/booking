import React from "react"
import useMediaQuery from '@material-ui/core/useMediaQuery';

const getDevice = (overSE, overX, overSmartPhone, overiPad) => {
    if (overiPad) return 'iPadPro'
    else if (overSmartPhone) return 'iPad'
    else if (overX) return 'iPhoneXPlus'
    else if (overSE) return 'iPhoneX'
    return 'iPhoneSE'
}

const useDevice = () => {
    const [device, setDevice] = React.useState('iPhoneX');

    const overSE = useMediaQuery('(min-width:374px)'); // over iPhoneSE
    const overX = useMediaQuery('(min-width:413px)'); // over iPhoneX
    const overSmartPhone = useMediaQuery('(min-width:600px)'); // over iPhoneXPlus
    const overiPad = useMediaQuery('(min-width:769px)'); // over iPad

    React.useEffect(() => {
        const device = getDevice(overSE, overX, overSmartPhone, overiPad)
        setDevice(device)
    }, [overSE, overX, overSmartPhone, overiPad, device]);

    return device;
}

export default useDevice