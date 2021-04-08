import * as React from "react"
import { Nullable } from "../utils/context"
import {
  TextField,
  Grid,
  makeStyles,
  Button,
  Typography,
} from "@material-ui/core"
import Notification from "../components/Notification"
import { NotificationType } from "../components/Notification"
import { useState } from "react"
import { useHistory } from "react-router-dom"

const useStyles = makeStyles({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: "8px",
    },
  },
  pageSideBar: {
    margin: "8px",
    padding: "50px",
    backgroundColor: "rgb(238,235,228)",
  },
  pageContent: {
    margin: "10px",
    padding: "80px",
    backgroundColor: "rgb(234,232,224)",
  },
  submitButton: {
    margin: "1px",
  },
  cancelButton: {
    margin: "1px",
  },
  sideBar: {
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    "@media (min-width:1100px)": {
      fontSize: "1.5rem",
    },
  },
})

export default function ResetPassword(): JSX.Element {
  const [newPassword, setNewPassword] = React.useState<Nullable<string>>(null)
  const [secondNewPassword, setSecondNewPassword] = React.useState<
    Nullable<string>
  >(null)
  const [verificationCode, setVerificationCode] = React.useState<
    Nullable<string>
  >(null)
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<NotificationType["type"]>("success")
  const [message, setMessage] = useState(
    "Your password has been successfully changed"
  )
  const classes = useStyles()
  const history = useHistory()

  React.useEffect(() => {
    setIsOpen(true)
    setType("info")
    setMessage("A verication code has been sent to your email")
  }, [])

  const handleSave = () => {
    history.push("/")
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Grid container>
        <Grid item className={classes.pageContent}>
          <Typography variant="h5">Reset your password</Typography>
          <form
            className={classes.root}
            onSubmit={(e) => {
              e.preventDefault()
              handleSave()
            }}
          >
            <Grid container spacing={2} direction="column" justify="center">
              <Grid item xs={12}>
                <TextField
                  label="Verification code"
                  name="name"
                  value={verificationCode || ""}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <TextField
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword || ""}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Retype New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={secondNewPassword || ""}
                  onChange={(e) => setSecondNewPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.submitButton}
                  size="large"
                  type="submit"
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
          <Notification
            isOpen={isOpen}
            type={type}
            message={message}
            setisOpen={setIsOpen}
            handleClose={handleClose}
          />
        </Grid>
      </Grid>
    </>
  )
}
