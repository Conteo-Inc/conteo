import * as React from 'react';
import { request } from '../utils/fetch';
import type { User } from '../App';
import ProfileSidebar from '../components/ProfileSidebar';
import ProfileContent from '../components/ProfileContent';
import type { Props as ProfileContentProps } from '../components/ProfileContent';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    sideBar: {
        padding: 10,
        backgroundColor: 'rgb(238, 235, 228)',
    },
    section: {
        padding: 50,
        backgroundColor: 'rgb(234, 232, 224)',
    },
});

export default function Profile() {
    const classes = useStyles();

    const [username, setUsername] = React.useState<string>(null);
    React.useEffect(() => {
        request<User>('/api/current_user/', 'get', true, false).then(
            (user) => {
                setUsername(user.parsedBody.username);
            }
        );
    });

    // Dummy data.
    const content: ProfileContentProps = {
        username: username,
        name: 'Tom Cruise',
        profileImg: '',
        gender: 'Male',
        religion: 'Scientology',
        location: 'Hollywood',
        occupations: ['All the above'],
        age: '58',
        interests: ['Acting', 'Film Producing'],
    };

    return (
        <Grid container className={classes.root}>
        <Grid container item className={classes.sideBar} xs={3}>
            <ProfileSidebar name={content.name} profileImg={content.profileImg} />
            </Grid>
            <Grid container item className={classes.section} xs={9}>
                <ProfileContent username={content.username} name={content.name}
                    profileImg={content.profileImg} gender={content.gender}
                    religion={content.religion} location={content.location}
                    occupations={content.occupations} age={content.age}
                    interests={content.interests} />
                {/* Other components (e.g. Notifications, Settings, and Privacy)
                will be added here with attribute hidden */}
            </Grid>
        </Grid>
    );
}
