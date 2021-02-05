import { Dialog, DialogContent, DialogTitle, DialogActions, Typography, makeStyles, IconButton, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as React from 'react';


export type ModalType =  {
    title: string;
    description: string; 
    confirmText: string;
    cancelText: string;
    isOpen: boolean;
    handleConfirm: (e) => void;
    handleCancel: (e) => void;
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


export default function AbstractModal(props) {
    const {modal, setModal} = props;
    const classes = useStyles()

    return (
        <Dialog open={modal.isOpen}  classes={{paper: classes.modal}}>
            <DialogTitle>
                <IconButton className={classes.modalTitle} onClick={()=>setModal({...modal, isOpen: false})}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.modalContent}>
                <Typography variant="h6">
                    {modal.title}
                </Typography>
                <Typography variant="subtitle2">
                    {modal.description}
                </Typography>  
            </DialogContent>
            <DialogActions className={classes.modalAction}>
                <Button variant="contained" onClick={modal.handleCancel} color="secondary">{modal.cancelText}</Button>
                <Button variant="contained" onClick={modal.handleConfirm} color="default">{modal.confirmText}</Button>
            </DialogActions>
        </Dialog>
    )
}
