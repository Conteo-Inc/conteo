import { Snackbar, makeStyles } from "@material-ui/core"
import * as React from "react"
import Alert from "@material-ui/lab/Alert"

type NotificationType = {
  isOpen: boolean
  type: "error" | "info" | "success" | "warning"
  message: string
  setisOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleClose: any
}

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(9), //Change this depending on size of header
  },
}))

export default function Notification(props: NotificationType) {
  const classes = useStyles()

  return (
    <Snackbar
      className={classes.root}
      open={props.isOpen}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={props.handleClose}
    >
      <Alert severity={props.type} onClose={props.handleClose}>
        {props.message}
      </Alert>
    </Snackbar>
  )
}
