import * as React from 'react';
import { Link } from 'react-router-dom';
import { request } from '../utils/fetch';
import type { User } from '../App';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    sideBar: {
        padding: 10,
        backgroundColor: 'rgb(238, 235, 228)',
    },
    sideBarTab: {
        padding: 15,
        borderBottom: '2px solid black',
        cursor: 'pointer',
    },
    sideBarTabTitle: {
        fontSize: 1.5 + 'rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    sideBarHeaderAvatar: {
        height: 60,
        width: 60,
    },
    sideBarHeaderName: {
        fontSize: 2 + 'rem',
        padding: '32px 0px',
    },

    profile: {
        backgroundColor: 'rgb(234, 232, 224)',
    },
    profileItem: {
        padding: 20,
    },
});

// const useStyles = makeStyles({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         justifyContent: 'space-around',
//     },
//     gridList: {
//         width: 'auto',
//         height: 600,
//     },
// });

export default function Profile() {
    const [username, setUsername] = React.useState<string>(null);
    const classes = useStyles();

    React.useEffect(() => {
        request<User>('/api/current_user/', 'get', true, false).then(
            (user) => {
                setUsername(user.parsedBody.username);
            }
        );
    });

    // Values defined according to user profile data.
    const {
        name,
        profileImg,
        gender,
        email,
        religion,
        location,
        occupation,
        age,
        interests
    } =
    {
        name: 'Tom Cruise',
        profileImg: '/static/images/tom.png',
        gender: 'Male',
        email: 'stuntman@tomcruise.com',
        religion: 'Scientology',
        location: 'Hollywood',
        occupation: 'All the above',
        age: '58',
        interests: ['Acting', 'Film Producing'],
    }

    const profileValues = [
        {
            title: 'Full Name',
            value: name
        },
        {
            title: 'Age',
            value: age
        },
        {
            title: 'Interests',
            value: interests
        },
    ];

    return (
        <Grid container className={classes.root}>
            <Grid container item className={classes.sideBar} xs={3}>
                <Grid container item className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <Avatar alt={name} src={profileImg} className={classes.sideBarHeaderAvatar} />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={`${classes.sideBarHeaderName} ${classes.sideBarTabTitle}`}>{name}</Typography>
                    </Grid>
                </Grid>
                <Grid container item className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <PersonIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Bio</Typography>
                    </Grid>
                </Grid>
                <Grid container item className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <NotificationsIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Notifications</Typography>
                    </Grid>
                </Grid>
                <Grid container item className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <SettingsIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Settings</Typography>
                    </Grid>
                </Grid>
                <Grid container item className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <MailIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Contact Us</Typography>
                    </Grid>
                </Grid>
                <Grid container item className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <LockIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Privacy</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className={classes.profile} xs={9}>
                <Typography className={classes.profileItem}>Remove</Typography>
                <Typography className={classes.profileItem}>Remove</Typography>
            </Grid>
        </Grid>

        // <GridList cellHeight={400} className={classes.gridList} cols={2}>
        //     <GridList cellHeight={100} cols={1}>
        //         {sideBar.map((tile) => (
        //             <GridListTile key={tile.title} cols={1}>
        //                 <GridList cellHeight={100} cols={2}>
        //                     <GridListTile cols={1}>
        //                         <img src={tile.icon} alt={tile.title + ' icon'} />
        //                     </GridListTile>
        //                     <GridListTile cols={1}>
        //                         <h4>{tile.title}</h4>
        //                     </GridListTile>
        //                 </GridList>
        //             </GridListTile>
        //         ))}
        //     </GridList>
        //     <GridList cellHeight={100} cols={1}>
        //         {profileValues.map((tile) => (
        //             <GridListTile key={tile.title} cols={2}>
        //                 <GridList cellHeight={100} cols={2}>
        //                     <GridListTile cols={1}>
        //                         <h4>{tile.title}: </h4>
        //                     </GridListTile>
        //                     <GridListTile cols={1}>
        //                         <h4>{tile.value}</h4>
        //                     </GridListTile>
        //                 </GridList>
        //             </GridListTile>
        //         ))}
        //     </GridList>
        // </GridList>
    );
}
