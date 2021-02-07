import { Dialog, DialogContent, DialogTitle, DialogActions, Typography, makeStyles, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';


type ModalType =  {
    title: string;
    description: string; 
    confirmText?: string;
    cancelText?: string;
    isOpen: boolean;
    setisOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleConfirm?: any;
    handleCancel?: any;
};

const useStyles = makeStyles(theme =>({
    modal:{
        position:'absolute',
        top: theme.spacing(5),
        padding: theme.spacing(2)
    },
    modalContent:{
        textAlign: 'center'
    },
    modalAction:{
        justifyContent: 'center'
    },
    modalTitle: {
        position: 'absolute',
        top: theme.spacing(2),
        right: theme.spacing(0.5)
    }
}))


export default function AbstractModal(props: ModalType) {
    const classes = useStyles()

    const handleCancel = () => { 
        props.setisOpen(false)
        if(props.handleCancel != null){
            props.handleCancel()
        }
    }

    const handleConfirm = () => { 
        if(props.handleConfirm != null){
            props.handleConfirm()
        }
    }

    return (
        <Dialog open={props.isOpen}  classes={{paper: classes.modal}}>
            <DialogTitle>
                <IconButton className={classes.modalTitle} onClick={handleCancel}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.modalContent}>
                <Typography variant="h6">
                    {props.title}
                </Typography>
                <Typography variant="subtitle2">
                    {props.description}
                </Typography>  
            </DialogContent>
            <DialogActions className={classes.modalAction}>
                <Button variant="contained" onClick={handleCancel} color="secondary">{props.cancelText || "NO"}</Button>
                <Button variant="contained" onClick={handleConfirm} color="default">{props.confirmText || "YES"}</Button>
            </DialogActions>
        </Dialog>
    )
}
