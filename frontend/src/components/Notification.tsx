import { Snackbar, makeStyles } from "@material-ui/core"
import * as React from "react"
import Alert from "@material-ui/lab/Alert"
import { SetStateDispatch } from "../utils/context"

type NotificationType = {
  isOpen: boolean
  type: "error" | "info" | "success" | "warning"
  message: string
  setisOpen: SetStateDispatch<boolean>
  handleClose: (event: React.SyntheticEvent<Element, Event>) => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(9), //Change this depending on size of header
  },
}))

export default function Notification(props: NotificationType): JSX.Element {
  const classes = useStyles()

  return (
    // FIXME props.handleClose is set on both Snackbar.onClose and
    // Alert.onClose. This is probably a bug
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
