import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  makeStyles,
  IconButton,
  Button,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import * as React from "react"

type ModalType = {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isOpen: boolean
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleConfirm: any
  handleCancel: any
}

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    top: theme.spacing(5),
    padding: theme.spacing(2),
  },
  modalContent: {
    textAlign: "center",
  },
  modalAction: {
    justifyContent: "center",
  },
  modalTitle: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(0.5),
  },
}))

export default function AbstractModal(props: ModalType) {
  const classes = useStyles()

  return (
    <Dialog open={props.isOpen} classes={{ paper: classes.modal }}>
      <DialogTitle>
        <IconButton className={classes.modalTitle} onClick={props.handleCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <Typography variant="h6">{props.title}</Typography>
        <Typography variant="subtitle2">{props.description}</Typography>
      </DialogContent>
      <DialogActions className={classes.modalAction}>
        <Button
          variant="contained"
          onClick={props.handleCancel}
          color="secondary"
        >
          {props.cancelText || "NO"}
        </Button>
        <Button
          variant="contained"
          onClick={props.handleConfirm}
          color="default"
        >
          {props.confirmText || "YES"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
