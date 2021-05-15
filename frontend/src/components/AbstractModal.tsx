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
import { ButtonStyle } from "../utils/colors"

type ModalType = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  isModalOpen: boolean
  handleConfirm?: () => void
  handleCancel: () => void
  isActionable?: boolean
  children?: React.ReactNode
}

const useStyles = makeStyles((theme) => ({
  modal: {
    position: "absolute",
    top: "0px",
    left: "50%",
    transform: "translate(-50%, 25%)",
    margin: "0px",
  },
  modalContent: {
    textAlign: "center",
  },
  modalAction: {
    margin: "25px 50px",
    padding: "0px",
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
  confirmText = "YES",
  cancelText = "NO",
  isModalOpen,
  handleConfirm,
  handleCancel,
  isActionable = true,
  children,
}: ModalType): JSX.Element {
  const classes = useStyles()

  return (
    <Dialog open={isModalOpen} classes={{ paper: classes.modal }}>
      <DialogTitle>
        <IconButton className={classes.modalTitle} onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="subtitle2">{description}</Typography>
        {children}
      </DialogContent>
      {isActionable && (
        <DialogActions className={classes.modalAction}>
          <Button
            variant="contained"
            onClick={handleCancel}
            style={ButtonStyle}
            color="secondary"
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            style={ButtonStyle}
            color="default"
          >
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
