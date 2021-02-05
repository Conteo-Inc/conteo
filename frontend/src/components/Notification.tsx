import { Snackbar, makeStyles } from '@material-ui/core'
import * as React from 'react';
import Alert from '@material-ui/lab/Alert';


export type NotificationType =  {
    isOpen: boolean;
    type: 'error' | 'info' | 'success' | 'warning'; 
    message: string;
};



const useStyles = makeStyles(theme => ({
    root:{
        top: theme.spacing(9) //Change this depending on size of header
    }
}));

export default function Notification(props) {
    const {notify, setNotify} = props
    const classes = useStyles()

    const handleClose = (e) => { 
        setNotify({ 
            ...notify,
            isOpen: false
        })
    }

    return (
        <Snackbar
        className={classes.root}
        open={notify.isOpen}
        autoHideDuration={2000}
        anchorOrigin={{vertical: 'top', horizontal:'right' }}
        onClose={handleClose}
        >
            <Alert 
            severity={notify.type}
            onClose={handleClose}
            >
                {notify.message}
            </Alert>
        </Snackbar>
    )
}


{/* <Notification notify ={notify} setNotify={setNotify} /> */}
 