import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {},
    title: {
        marginBottom: 12,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

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

const MenuForm = ({ handleNext }) => {
     const contentful = useStaticQuery(query)
    const classes = useStyles();

    const [menu, setMenu] = React.useState({});
    const [toggle, setToggle] = React.useState(false);

    const next = menu => {
        document.getElementById("dialog-root-position").scrollIntoView(true);
        console.log(menu);
        handleNext({
            menu: { time: 0 },
            off: menu
        })
        setToggle(true)
        setMenu({
            menu
        })
    };

    const back = () => {
        document.getElementById("dialog-root-position").scrollIntoView(true);
        setToggle(false);
    };

    const submit = off => {
        console.log(off)
        handleNext({
            ...menu,
            off
        })
    };

    return (<>
        {!toggle && (
            <Grid container spacing={3}>
                {contentful.allContentfulMenu.edges.map(menu => menu.node).map((menu) =>
                (<Grid key={menu.contentfulid} item xs={12} sm={6} md={6}>
                    <Card onClick={() => next(menu)} className={classes.root} >
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {menu.name}
                            </Typography>
                            <br />
                            <Typography variant="h6" component="h3" className={classes.title}>
                                {menu.time}分
                                </Typography>
                            <Typography variant="body2" component="p" color="textSecondary">
                                {menu.description.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>)
                )}
            </Grid>
        )}
        {toggle && (
            <>
                <Grid container spacing={3}>
                    {contentful.allContentfulSideMenu.edges.map(menu => menu.node).map((menu) =>
                    (<Grid key={menu.contentfulid} item xs={12} md={6}>
                        <Card onClick={() => submit(menu)} className={classes.root} >
                            <CardContent>
                                <Typography variant="h5" component="h2" className={classes.title}>
                                    {menu.name}
                                </Typography>
                                <Typography variant="body2" component="p" color="textSecondary">
                                    {menu.description?.description}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Box mb="1rem" />
                    </Grid>)
                    )}
                </Grid>
                <Button onClick={back} className={classes.button}>
                    メニューへ
                </Button>
            </>
        )}
    </>);
}

export default MenuForm