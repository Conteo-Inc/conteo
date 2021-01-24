import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import { Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    header: {
        backgroundColor: '#cd0b2d',
        height: '3rem',
        padding: '0 1rem',
    },
    footer: {
        backgroundColor: '#760000',
        height: '3rem',
        padding: '0 1rem',
    },
    bannerText: {
        color: 'white',
    },
});

//@TODO: Move links to common file
function MainPage() {
    return (
        <ul>
            <LinkItem to='/Tokens' text='Tokens' />
        </ul>
    );
}

export default function App() {
    const classes = useStyles();
    return (
        <Router>
            <Grid
                container
                direction='row'
                justify='space-between'
                alignItems='center'
                className={classes.header}
            >
                <Typography variant='h5' className={classes.bannerText}>
                    {'Hi, Jane'}
                </Typography>
                {/* Figure out sizes */}
                <Grid item lg={2} sm={2} xs={2}>
                    <Grid container direction='row' justify='space-between'>
                        <Typography className={classes.bannerText}>
                            {'About'}
                        </Typography>
                        <Typography className={classes.bannerText}>
                            {'Contact Us'}
                        </Typography>
                        <Typography className={classes.bannerText}>
                            {'Help'}
                        </Typography>
                        <Typography className={classes.bannerText}>
                            {'Log Out'}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Switch>
                <Route path='/Tokens'>
                    <TokenPage />
                </Route>
                <Route path='/'>
                    <MainPage />
                </Route>
            </Switch>
            <Grid
                container
                direction='row'
                justify='space-between'
                alignItems='flex-end'
                className={classes.footer}
            >
                <Grid item lg={2}>
                    <Grid container direction='row' justify='space-between'>
                        <Typography className={classes.bannerText}>
                            {'Privacy Policy'}
                        </Typography>
                        <Typography className={classes.bannerText}>
                            {'Terms of Service'}
                        </Typography>
                    </Grid>
                </Grid>
                <Typography className={classes.bannerText}>
                    {'Copyright 2020'}
                </Typography>
            </Grid>
        </Router>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);
