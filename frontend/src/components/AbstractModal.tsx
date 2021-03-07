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
import { SetStateDispatch } from "../utils/context"

type ModalType = {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isOpen: boolean
  setisOpen: SetStateDispatch<boolean>
  handleConfirm: any
  handleCancel?: any
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

export default function AbstractModal({
  title,
  description,
  confirmText,
  cancelText,
  isOpen,
  setisOpen,
  handleConfirm,
  handleCancel,
}: ModalType): JSX.Element {
  const classes = useStyles()

  const handleAction = (action: any) => {
    setisOpen(false)
    action()
  }

  return (
    <Dialog open={isOpen} classes={{ paper: classes.modal }}>
      <DialogTitle>
        <IconButton className={classes.modalTitle} onClick={() => {handleAction(handleCancel)}}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle2">{description}</Typography>
      </DialogContent>
      <DialogActions className={classes.modalAction}>
        <Button
          variant="contained"
          onClick={() => {handleAction(handleCancel)}}
          color="secondary"
        >
          {cancelText || "NO"}
        </Button>
        <Button
          variant="contained"
          onClick={() => {handleAction(handleConfirm)}}
          color="default"
        >
          {confirmText || "YES"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
