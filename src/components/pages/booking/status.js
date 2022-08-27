import React from 'react';
import moment from 'moment';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import useConfirm from '../../../hooks/useConfirm'
import useDevice from '../../../hooks/useDevice'
import userResavationTable from '../../../hooks/useResavationTable'
import Const from '../../../const'

const DeviceSettingMapping = {
    iPhoneSE: {
        cols: 3,
        tableHeignt: { maxHeight: 0.50 }
    },
    iPhoneX: {
        cols: 3,
        tableHeignt: { maxHeight: 0.58 }
    },
    iPhoneXPlus: {
        cols: 4,
        tableHeignt: { maxHeight: 0.59 }
    },
    iPad: {
        cols: 7,
        tableHeignt: { maxHeight: 0.65 }
    },
    iPadPro: {
        cols: 7,
        tableHeignt: { maxHeight: 0.75 }
    },
}

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    root: {
        width: '100%'
    }
});

const Navigation = ({ navigation, page, handleChange, classes }) => (
    <BottomNavigation
        value={navigation}
        onChange={handleChange}
        className={classes.root}
    >
        <BottomNavigationAction disabled={page === 0} label="前へ" icon={<ArrowBackIosIcon />} />
        <BottomNavigationAction label="次へ" icon={<ArrowForwardIosIcon />} />
    </BottomNavigation>
)

function createData(at, today, tomorrow, daysAfter2, daysAfter3, daysAfter4, daysAfter5, daysAfter6) {
    return { at, today, tomorrow, daysAfter2, daysAfter3, daysAfter4, daysAfter5, daysAfter6 };
}

const start = new Date()

const StatusForm = ({ handleNext, form }) => {
    const confirm = useConfirm();
    const device = useDevice();
    const reservationTable = userResavationTable({ start, frame: (form.menu.time + form.off.time) / 30 })
    const classes = useStyles();

    /**
     * Device Settings 
     */
    const [deviceSettings, setDeviceSettings] = React.useState({
        cols: 3,
        tableHeignt: { maxHeight: 0.58 }
    });

    /**
     * Page Settings 
     */
    const [page, setPage] = React.useState(0);

    React.useEffect(() => {
        const settings = DeviceSettingMapping[device]
        const tableHeignt = { maxHeight: window.innerHeight * settings.tableHeignt.maxHeight + 'px' };
        setDeviceSettings({ ...settings, tableHeignt });

        const cols = settings.cols
        const date = moment(start)
        const startAt = cols * page
        date.add(startAt, 'days');

        const headers = [{ id: 'blank', label: '' }]

        for (let i = 0; i < cols; i++) {
            const day = date.add(i && 1, 'days')
            const id = day.format('YYYYMMDD')
            headers.push({ id, label: day.format('M/D') })
        }
        setColums(headers)

        const data =
            reservationTable.map(row => createData(row.time, row[startAt], row[startAt + 1], row[startAt + 2], row[startAt + 3], row[startAt + 4], row[startAt + 5], row[startAt + 6]))
        setRows(data)

    }, [reservationTable, device, page]);

    /**
     * Compornent State 
     */
    const [navigation, setNavigation] = React.useState(1);
    const [columns, setColums] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    const handleChange = async (_, newValue) => {
        if (newValue && Const.reservableRange <= (page + 1) * deviceSettings.cols) {
            await confirm({ alert: true, description: 'これ以上先の予約はできません' })
            return
        }

        setNavigation(newValue)

        if (newValue) next()
        else prev();
    };

    const prev = () => {
        console.log('prev')
        setPage(page - 1)
    };

    const next = () => {
        console.log('next')
        setPage(page + 1)
    };

    const handleClickOpenBooking = (day, at) => {
        const now = moment(start);
        const date = now.add(day + page * deviceSettings.cols, "days").format("YYYY-MM-DD");
        console.log(date, at)
        handleNext({ date, at })
    };

    return (
        <>
            <Paper elevation={3} className={classes.root}>
                <TableContainer style={deviceSettings.tableHeignt}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columns.slice(0, deviceSettings.cols + 1).map((column) => (
                                    <TableCell
                                        key={column.id}
                                        size={'small'}
                                        align="center"
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.at}>
                                    <TableCell component="th" scope="row">
                                        {row.at}
                                    </TableCell>
                                    <TableCell align="center">
                                        {!!row.today && (
                                            <Link color="inherit" onClick={() => handleClickOpenBooking(0, row.at)}>{row.today}</Link>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {!!row.tomorrow && (
                                            <Link color="inherit" onClick={() => handleClickOpenBooking(1, row.at)}>{row.tomorrow}</Link>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {!!row.daysAfter2 && (
                                            <Link color="inherit" onClick={() => handleClickOpenBooking(2, row.at)}>{row.daysAfter2}</Link>
                                        )}
                                    </TableCell>
                                    {4 <= deviceSettings.cols && (
                                        <TableCell align="center">
                                            {!!row.daysAfter3 && (
                                                <Link color="inherit" onClick={() => handleClickOpenBooking(3, row.at)}>{row.daysAfter3}</Link>
                                            )}
                                        </TableCell>
                                    )}
                                    {4 < deviceSettings.cols && (
                                        <>
                                            <TableCell align="center">
                                                {!!row.daysAfter4 && (
                                                    <Link color="inherit" onClick={() => handleClickOpenBooking(4, row.at)}>{row.daysAfter4}</Link>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {!!row.daysAfter5 && (
                                                    <Link color="inherit" onClick={() => handleClickOpenBooking(5, row.at)}>{row.daysAfter5}</Link>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {!!row.daysAfter6 && (
                                                    <Link color="inherit" onClick={() => handleClickOpenBooking(6, row.at)}>{row.daysAfter6}</Link>
                                                )}
                                            </TableCell>
                                        </>
                                    )}
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper elevation={1} className={classes.root}>
                <Navigation navigation={navigation} page={page} handleChange={handleChange} classes={classes} />
            </Paper>
        </>
    );
}

export default StatusForm