import {
  Grid,
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
  description?: string
  confirmText?: string
  cancelText?: string
  isModalOpen: boolean
  handleConfirm: () => void
  handleCancel: () => void
  children?: JSX.Element
}

const useStyles = makeStyles({
  modal: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translate(-50%, 25%)",
    margin: 0,
  },
  close: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  title: {
    margin: "25px 50px",
    padding: 0,
  },
  modalContent: {
    padding: 0,
    textAlign: "center",
  },
  modalAction: {
    margin: "25px 50px",
    padding: 0,
    justifyContent: "center",
  },
})

export default function AbstractModal({
  title,
  description,
  confirmText,
  cancelText,
  isModalOpen,
  handleConfirm,
  handleCancel,
  children,
}: ModalType): JSX.Element {
  const classes = useStyles()

  return (
    <Dialog open={isModalOpen} classes={{ paper: classes.modal }}>
      <IconButton className={classes.close} onClick={handleCancel}>
        <CloseIcon />
      </IconButton>
      <DialogTitle className={classes.title}>
        <Grid container>
          <Grid item container alignItems="center" justify="center" xs={12}>
            <Typography variant="h6">{title}</Typography>
          </Grid>
          <Grid item container alignItems="center" justify="center" xs={12}>
            <Typography variant="subtitle2">{description}</Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent className={classes.modalContent}>{children}</DialogContent>
      <DialogActions className={classes.modalAction}>
        <Button variant="contained" onClick={handleCancel} color="secondary">
          {cancelText || "NO"}
        </Button>
        <Button variant="contained" onClick={handleConfirm} color="default">
          {confirmText || "YES"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
