import * as React from 'react';
import {
    Box,
    Container,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import Person from '@material-ui/icons/Person';
import ListAlt from '@material-ui/icons/ListAlt';
import Mail from '@material-ui/icons/Mail';
import Info from '@material-ui/icons/Info';
import Help from '@material-ui/icons/Help';
import MailList from '../components/MailList';

//Not sure how to put these in, we should look into it:
// @media (prefers-reduced-motion: no-preference) {
//     .App-logo {
//       animation: App-logo-spin infinite 20s linear;
//     }
//   }
// @keyframes App-logo-spin {
//     from {
//       transform: rotate(0deg);
//     }
//     to {
//       transform: rotate(360deg);
//     }
//   }

const useStyles = makeStyles({
    dashboard: {
        textAlign: 'center',
        logo: {
            height: '40vmin',
            pointerEvents: 'none',
        },
    },
    drawPaper: {
        width: 'inherit',
    },
    link: {
        color: '#61dafb',
    },
});

export default function Dashboard() {
    const classes = useStyles();

    return (
        <Box className={classes.dashboard}>
            <Router>
                <Box display='flex'>
                    <Drawer
                        style={{ width: '240px' }}
                        variant='persistent'
                        anchor='left'
                        open
                        classes={{ paper: classes.drawPaper }}
                    >
                        <List>
                            <Link to='/' className={classes.link}>
                                <ListItem button>
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText primary='Home' />
                                </ListItem>
                            </Link>
                        </List>
                        <Link to='/profile' className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <Person />
                                </ListItemIcon>
                                <ListItemText primary={'My Profile'} />
                            </ListItem>
                        </Link>
                        <Link to='/penpal' className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <ListAlt />
                                </ListItemIcon>
                                <ListItemText primary={'Penpal List'} />
                            </ListItem>
                        </Link>
                        <Link to='/mail' className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <Mail />
                                </ListItemIcon>
                                <ListItemText primary={'Penpal Mail'} />
                            </ListItem>
                        </Link>
                        <Link to='/faqs' className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <Info />
                                </ListItemIcon>
                                <ListItemText primary={'FAQs'} />
                            </ListItem>
                        </Link>
                        <Link to='/help' className={classes.link}>
                            <ListItem button>
                                <ListItemIcon>
                                    <Help />
                                </ListItemIcon>
                                <ListItemText primary={'Tutorials'} />
                            </ListItem>
                        </Link>
                    </Drawer>
                    <Switch>
                        <Route exact path='/'>
                            <Container>
                                <Typography variant='h3' gutterBottom>
                                    Welcome to CONTEO!!
                                </Typography>
                            </Container>
                        </Route>
                        <Route exact path='/profile'>
                            <Container>
                                <Typography variant='h3' gutterBottom>
                                    My Profile
                                </Typography>
                            </Container>
                        </Route>
                        <Route exact path='/penpal'>
                            <Container>
                                <Typography variant='h3' gutterBottom>
                                    Penpal List
                                </Typography>
                            </Container>
                        </Route>
                        <Route exact path='/mail'>
                            <Container>
                                <Typography variant='h3' gutterBottom>
                                    Penpal Mail
                                </Typography>
                                <MailList />
                            </Container>
                        </Route>
                        <Route exact path='/faqs'>
                            <Container>
                                <Typography variant='h3' gutterBottom>
                                    FAQs
                                </Typography>
                            </Container>
                        </Route>
                        <Route exact path='/help'>
                            <Container>
                                <Typography variant='h3' gutterBottom>
                                    Tutorials
                                </Typography>
                            </Container>
                        </Route>
                    </Switch>
                </Box>
            </Router>
        </Box>
    );
}
