import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography, Toolbar, AppBar, Button, Paper, Drawer } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// Get username from the database
export type MailProps ={
    profilePic: string;
    username: string;
}

type Mail = {
    profile: string;
    name: string;
    message: string;
    dateReceived: string;

}

type DashboardItems = {
    icon: JSX.Element;
    optionsName: string;
}

const useStyles = makeStyles({

    header: {
        flexGrow: 1,
    
    },
    headerBar:{
        color: "white",
    },
    user:{
        flexGrow: 1,
        color: "white",
    },

    Paper:{
        padding:20,
        marginTop: 10,
        marginBottom: 20,
    },
    drawerPaper:{
        
        
    },
    sideBar: {

    },
    bar:{
        padding:15,
        cursor: 'pointer'

    },
    barName:{
        fontSize: '1rem',
        fontWeight:'bold',
        cursor:'pointer',
        '@media (min-width:1100px)':{
            fontSize: '1.5rem',    
        },

    },
    mainBar:{
        cursor: 'pointer',
        padding: 10,

    },
    profile:{

    },
    main:{
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        flexGrow: 1,

    },

})


export default function DashboardPage(props:MailProps){
    const [state, mailState] = useState('false');
    const classes = useStyles();

     // Add the options for the sidebar to the Dashboard list.
     const options: DashboardItems[] = [
        {
            icon: <MailIcon />,
            optionsName: 'Penpal Mails',
        },
        {
            icon: <VideoCallIcon />,
            optionsName: 'Start Video Call',
        },
        {
            icon: <SearchIcon />,
            optionsName: 'Find Penpal',
        },
        {
            icon: <EditIcon />,
            optionsName: 'Edit Profile',
        },
        {
            icon: <InfoIcon />,
            optionsName: 'Tutorials',
        },
    ];
    const contents: Mail[] = [
        {
            profile: props.profilePic,
            name: props.username,
            message: 'New Video',
            dateReceived: 'Oct 22',
        },
    ];


    return(
        <>

            <div className={classes.header}>
                <AppBar position="static" className={classes.headerBar} color="secondary">
                    <Toolbar>
                        <Typography className={classes.user}>
                                Hi, {props.username}
                        </Typography>
                        <Button color='inherit'>Home</Button>
                                <Button color="inherit">About</Button>
                                <Button color="inherit">Contact Us</Button>
                                <Button color="inherit">Help</Button>
                                <Button color="inherit">Log Out</Button>
                                
                            </Toolbar>
                        </AppBar>
            </div>
            <Grid container>
            <Paper className={classes.Paper}>
            {options.map(({ icon, optionsName }: DashboardItems) => (
            <Grid key={optionsName} container item className={classes.bar} xs={12}>
                
                    <Grid container item alignItems="center" justify="center" xs={3}>
                        {icon}
                    </Grid>
                
                <Grid container item alignItems="center" xs={9}>
                    <Typography className={classes.barName}>{optionsName}</Typography>
                </Grid>
                
            </Grid>
        

        ))}
        </Paper>
        
        <Paper>
            {contents.map(({ profile, name, message, dateReceived }: Mail) =>(
                <Grid key={name} container item className={classes.mainBar} spacing={10} xs={12}>
                    <Grid container item alignItems="center" justify="center" xs={3}>
                        <Avatar src={props.profilePic} alt={props.username} className={classes.profile}/>
                    </Grid>
                    <Grid container item alignItems="center" xs={3}>
                        <Typography className={classes.main}>{props.username}</Typography>
                    </Grid>
                    <Grid container item alignItems="center" xs={3}>
                        <Typography className={classes.main}>{message}</Typography>
                    </Grid>
                    <Grid container item alignItems="center" xs={3}>
                        <Typography className={classes.main}>{dateReceived}</Typography>
                    </Grid>
                </Grid>
            ))}

        
        </Paper>
        </Grid>

       
        
            
        
           
            

        </>
    )
}