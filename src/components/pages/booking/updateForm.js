import React from 'react';
import moment from 'moment';
import { useStaticQuery, graphql } from 'gatsby';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Const from '../../../const'

const query = graphql`
  query {
    allContentfulMenu(sort: {fields: [order], order: ASC}) {
      edges {
        node {
          contentfulid
          name
          price
          time
          description {
            description
          }
        }
      }
    }
    allContentfulSideMenu(sort: {fields: [order], order: ASC}) {
      edges {
        node {
          contentfulid
          name
          price
          time
          description {
            description
          }
        }
      }
    }
  }
`

const UpdateForm = ({ register, setValue, form }) => {
     const contentful = useStaticQuery(query)

    React.useEffect(() => {
        console.log(form)
    }, [form]);

    // for react-fook-form
    React.useEffect(() => {
        register("day")
        register("hour")
        register("time")
        register("menuId")
        register("offId")
    }, [register])

    // for date time
    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-04-01'));
    const handleDateChange = date => {
        setSelectedDate(date)
        setValue("day", date)
    }
    React.useEffect(() => {
        setSelectedDate(moment(form.dateText, 'YYYY-MM-DD HH:mm').toDate())
    }, [form, setValue]);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Change Booking
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="yyyy-MM-dd"
                            margin="normal"
                            id="day"
                            label="Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            minDate={moment().format('YYYY-MM-DD')}
                            maxDate={moment().add(Const.reservableRange, 'days').format('YYYY-MM-DD')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native">Hour</InputLabel>
                        <NativeSelect
                            defaultValue={moment(form.dateText, 'YYYY-MM-DD HH:mm').format('HH')}
                            id="hour"
                            onChange={e => setValue("hour", e.target.value)}
                        >
                            {[10, 11, 12, 13, 14, 15, 16, 17, 18].map(hour => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native">Time</InputLabel>
                        <NativeSelect
                            defaultValue={moment(form.dateText, 'YYYY-MM-DD HH:mm').format('mm')}
                            id="time"
                            onChange={e => setValue("time", e.target.value)}
                        >
                            {['00', '30'].map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </NativeSelect>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native">Menu</InputLabel>
                        {form.menu?.contentfulid && (
                            <NativeSelect
                                defaultValue={form.menu?.contentfulid}
                                id="menuId"
                                onChange={e => setValue("menuId", e.target.value)}
                            >
                                {contentful.allContentfulMenu.edges.map(menu => menu.node).map(menu => (
                                    <option key={menu.contentfulid} value={menu.contentfulid}>{menu.name}</option>
                                ))}
                            </NativeSelect>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="uncontrolled-native">Off</InputLabel>
                        {form.off?.contentfulid && (
                            <NativeSelect
                                defaultValue={form.off?.contentfulid}
                                id="offId"
                                onChange={e => setValue("offId", e.target.value)}
                            >
                                {contentful.allContentfulSideMenu.edges.map(menu => menu.node).map(menu => (
                                    <option key={menu.contentfulid} value={menu.contentfulid}>{menu.name}</option>
                                ))}
                            </NativeSelect>
                        )}
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <TextField
                        id="request"
                        name="request"
                        label="Request"
                        defaultValue={form.request}
                        fullWidth
                        multiline
                        rows={3}
                        inputRef={register}
                        autoComplete="booking-request"
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default UpdateForm