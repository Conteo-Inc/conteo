import * as React from 'react';
import { Link } from 'react-router-dom';
import { request } from '../utils/fetch';
import type { User } from '../App';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, GridList, GridListTile, Button, Typography, TextField, FormHelperText, FormControl, FormControlLabel, Radio, RadioGroup, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            width: 'auto',
            height: 600,
        },
    }),
);


export default function Profile() {
    if (!localStorage.getItem('token')) {
        return
    }

    const [username, setUsername] = React.useState<string>(null);
    const classes = useStyles();

    React.useEffect(() => {
        request<User>('/api/current_user/', 'get', true, false).then(
            (user) => {
                setUsername(user.parsedBody.username);
            }
        );
    });

    // Values defined according to user data.
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
        profileImg: './test_images/profile_picture.png',
        gender: 'Male',
        email: 'stuntman@tomcruise.com',
        religion: 'Scientology',
        location: 'Hollywood',
        occupation: 'All the above',
        age: '58',
        interests: ['Acting', 'Film Producing'],
    }

    const sideBar = [
        {
            icon: '',
            title: name,
        },
        {
            icon: '',
            title: 'Bio',
        },
        {
            icon: '',
            title: 'Notifications',
        },
        {
            icon: '',
            title: 'Settings',
        },
        {
            icon: '',
            title: 'Contact Us',
        },
        {
            icon: '',
            title: 'Privacy',
        },
    ];

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
        <>
            <GridList cellHeight={400} className={classes.gridList} cols={2}>
                <GridList cellHeight={100} cols={1}>
                    {sideBar.map((tile) => (
                        <GridListTile key={tile.title} cols={1}>
                            <GridList cellHeight={100} cols={2}>
                                <GridListTile cols={1}>
                                    <img src={tile.icon} alt={tile.title + ' icon'} />
                                </GridListTile>
                                <GridListTile cols={1}>
                                    <h4>{tile.title}</h4>
                                </GridListTile>
                            </GridList>
                        </GridListTile>
                    ))}
                </GridList>
                <GridList cellHeight={100} cols={1}>
                    {profileValues.map((tile) => (
                        <GridListTile key={tile.title} cols={2}>
                            <GridList cellHeight={100} cols={2}>
                                <GridListTile cols={1}>
                                    <h4>{tile.title}: </h4>
                                </GridListTile>
                                <GridListTile cols={1}>
                                    <h4>{tile.value}</h4>
                                </GridListTile>
                            </GridList>
                        </GridListTile>
                    ))}
                </GridList>
            </GridList>
        </>
    );
}