import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography, Toolbar, AppBar, Button, Paper } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


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

    headerBar: {
        color: "white",
    },
    user:{
        flexGrow: 1,
        color: "white",
    },
   
    bar: {
        cursor: 'pointer',
        padding: 10,
        borderBottom: "2px",
        borderBottomColor: "black",
    },

    barName: {
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    sideBar:{
        direction: 'inherit',
        display: 'grid',
        gridColumn: 3,
        gridGap: 3,
   },
    mainbar: {
        cursor: 'pointer',
        padding: 10,
    },
    main:{
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    mailSection:{
        flexGrow: 1,
    },
    dashBar:{

    },
    profile:{

    },

   

});


export default function DashboardPage(props: MailProps) {
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


    return (
        
    <>
         <div className={classes.header}>
            <AppBar position="static" className={classes.headerBar}>
                <Toolbar>
                    <Typography className={classes.user}>
                            Hey, {props.username}
                    </Typography>
                    <Button color='inherit'>Home</Button>
                    <Button color="inherit">About</Button>
                    <Button color="inherit">Contact Us</Button>
                    <Button color="inherit">Help</Button>
                    <Button color="inherit">Log Out</Button>
                    
                </Toolbar>
            </AppBar>
            
        </div>
                
        <Grid container className={classes.sideBar} justify="center" spacing={0} xs={12}>
        {options.map(({ icon, optionsName }: DashboardItems) => (
            <Grid key={optionsName} item xs={6} justify="flex-start">
                
                <Paper className={classes.bar}>
                
                    <Grid item alignItems="center" justify="center" xs={3}>
                        {icon}
                    </Grid>
                
                <Grid item alignItems="center" xs={6}>
                    <Typography className={classes.barName}>{optionsName}</Typography>
                </Grid>
                </Paper>
                
            </Grid>
        ))}
        
        
        {contents.map(({ profile, name, message, dateReceived }: Mail) => (
            <Grid key={name} item xs={6} justify="flex-end">
                <Paper className={classes.mainbar}>
                <Grid  item alignItems="center" justify="center" xs={3}>
                    <Avatar src={props.profilePic} alt={props.username} className={classes.profile}/>
                </Grid>
                <Grid item alignItems="center" xs={3}>
                    <Typography className={classes.main}>{props.username}</Typography>
                </Grid>
                <Grid item alignItems="center" xs={3}>
                    <Typography className={classes.main}>{message}</Typography>
                </Grid>
                <Grid item alignItems="center" xs={3}>
                    <Typography className={classes.main}>{dateReceived}</Typography>
                </Grid>
                </Paper>
            </Grid>
        ))}
        
   </Grid>
    
    
    
      

    </>);
}
