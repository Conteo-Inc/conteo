import * as React from 'react';
import { request } from '../utils/fetch';
import type { User } from '../App';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography, Paper } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';

type ProfileField = {
    title: string;
    value: string;
};

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

    userInfoSection: {
        padding: 50,
        backgroundColor: 'rgb(234, 232, 224)',
    },
    profileHeader: {
        padding: '0 50',
    },
    fieldsContainer: {
        boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
        borderRadius: 4,
        color: 'rgba(0, 0, 0, 0.87)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        backgroundColor: '#fff',
        padding: '0 100px',
    },
    leftField: {
        padding: '5px 10px 5px 5px',
    },
    rightField: {
        padding: '5px 5px 5px 10px',
    },
    profileItemEntry: {
        fontSize: 2 + 'rem',
        paddingLeft: 10,
    },
    profileAvatar: {
        height: 200,
        width: 200,
    },
    introVideo: {
        height: 150,
        width: 200,
        backgroundColor: 'blue',
        color: 'white',
        textAlign: 'center',
    },
});

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


    // Dummy data that represents what could be retrieved from storage.
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

    // Add user profile values to list.
    var fields: ProfileField[] = [
        {
            title: 'Full Name',
            value: name
        },
        {
            title: 'Age',
            value: age
        },
        {
            title: 'Gender',
            value: gender
        },
        {
            title: 'Occupation',
            value: occupation
        },
        {
            title: 'Location',
            value: location
        },
        {
            title: 'Interests',
            value: interests.join(', ')
        },
        {
            title: 'Religion',
            value: religion
        },
    ];

    // let nameField: ProfileField = {
    //     title: 'Full Name',
    //     value: name
    // }

    return (
        <Grid container className={classes.root}>
            {/* BEGIN SIDEBAR */}
            {/* TODO: move sidebar to component */}
            <Grid container className={classes.sideBar} xs={3}>
                <Grid container className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <Avatar alt={name} src={profileImg} className={classes.sideBarHeaderAvatar} />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={`${classes.sideBarHeaderName} ${classes.sideBarTabTitle}`}>{name}</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <PersonIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Bio</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <NotificationsIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Notifications</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <SettingsIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Settings</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <MailIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Contact Us</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.sideBarTab} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={3}>
                        <LockIcon />
                    </Grid>
                    <Grid container alignItems="center" xs={9}>
                        <Typography className={classes.sideBarTabTitle}>Privacy</Typography>
                    </Grid>
                </Grid>
            </Grid>
            {/* END SIDEBARD */}
            {/* BEGIN PROFILE SECTION */}
            <Grid container className={classes.userInfoSection} xs={9}>
                <Grid container className={classes.profileHeader} xs={12}>
                    <Grid container alignItems="center" justify="center" xs={6}>
                        <Avatar alt={name} src={profileImg} className={classes.profileAvatar} />
                    </Grid>
                    <Grid container alignItems="center" justify="center" xs={6}>
                        <div className={classes.introVideo}>Intro Video</div>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" className={classes.fieldsContainer} xs={12}>
                    {fields.map(({ title, value }: ProfileField, i) => {
                        let className: string;
                        if (i % 2 == 0)
                            className = classes.leftField
                        else
                            className = classes.rightField

                        return (
                            <Grid item className={className} xs={6}>
                                <Typography>{title}: {value}</Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
            {/* END PROFILE SECTION */}
        </Grid>
    );
}
