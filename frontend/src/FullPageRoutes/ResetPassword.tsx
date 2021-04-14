import * as React from "react"
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
import { parseIdentity, request } from "../utils/fetch"
import { useParams } from "react-router-dom"

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

export type HandlerArgs = {
  newPassword: string | null
  secondNewPassword: string | null
  uidb64: string | null
  token: string | null
}

export default function ResetPassword(): JSX.Element {
  const [newPassword, setNewPassword] = React.useState<string>("")
  const [secondNewPassword, setSecondNewPassword] = React.useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<NotificationType["type"]>("success")
  const [message, setMessage] = useState(
    "Your password has been successfully changed"
  )
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>()
  const classes = useStyles()
  const history = useHistory()

  React.useEffect(() => {
    setIsOpen(true)
    setType("info")
    setMessage("Enter your new password")
  }, [])

  const handleSave = (curUser: HandlerArgs) => {
    if (newPassword !== secondNewPassword) {
      setType("error")
      setIsOpen(true)
      setMessage("Passwords do not match")
      return
    }
    request({
      path: "/api/changepassword/",
      method: "post",
      body: {
        newPassword: curUser.newPassword,
        secondNewPassword: curUser.secondNewPassword,
        uidb64: curUser.uidb64,
        token: curUser.token,
      },
      parser: parseIdentity,
    })
      .then(() => {
        setType("success")
        setIsOpen(true)
        setMessage("Password changed successfully")
        setTimeout(function () {
          console.log("I changed")
          history.push("/")
        }, 2000)
      })
      .catch((error: string) => {
        setType("error")
        setIsOpen(true)
        setMessage("Something went wrong!")
        console.log(error)
      })
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
              handleSave({ newPassword, secondNewPassword, uidb64, token })
            }}
          >
            <Grid container spacing={2} direction="column" justify="center">
              <Grid item xs={12}>
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
