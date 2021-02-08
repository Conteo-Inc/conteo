import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Avatar, Typography, Toolbar, AppBar, Button, Paper } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// Get username from the database
export type UserProps ={
    name: string;
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
        '@media (min-width:1100px)':{
            fontSize: '1.5rem',
        }
    },
    sideBar:{
        direction: 'inherit',
        display: 'grid',
        gridColumn: 3,
        gridGap: 3,
   },


   

});


export default function DashboardSidebar(props: UserProps) {
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

    return (
        
    <>
        <div className={classes.header}>
            <AppBar position="static" className={classes.headerBar}>
                <Toolbar>
                    <Typography className={classes.user}>
                            Hi, {props.name}
                    </Typography>
                    <Button color='inherit'>Home</Button>
                    <Button color="inherit">About</Button>
                    <Button color="inherit">Contact Us</Button>
                    <Button color="inherit">Help</Button>
                    <Button color="inherit">Log Out</Button>
                    
                </Toolbar>
            </AppBar>
            
        </div>

        
        <Grid container className={classes.sideBar} justify="flex-start" xs={6}>
        {options.map(({ icon, optionsName }: DashboardItems) => (
            <Grid key={optionsName} item className={classes.bar} sm={6}>
                
                    <Grid item alignItems="center" justify="center" xs={3}>
                        {icon}
                    </Grid>
                
                <Grid item alignItems="center" xs={6}>
                    <Typography className={classes.barName}>{optionsName}</Typography>
                </Grid>
                
            </Grid>
        ))}
        
    </Grid>
    
    
    
      

    </>);
}
