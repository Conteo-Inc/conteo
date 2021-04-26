import * as React from "react"
import {
  Avatar,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from "@material-ui/core"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import { Link } from "react-router-dom"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { red } from "@material-ui/core/colors"
import { Nullable, useStatefulLocation, useUser } from "../utils/context"
import { useHistory } from "react-router-dom"
import AbstractModal from "./AbstractModal"
import Notification, { NotificationType } from "./Notification"
import { useState } from "react"

export type UserHandlerArgs = {
  e: React.FormEvent<HTMLFormElement>
  username: string | null
  password: string | null
}
type LoginFormProps = {
  errorMessage: string | null
}

export const useStyles = makeStyles({
  paperStyle: {
    padding: 20,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  },
  avatarStyle: {
    backgroundColor: red[500],
  },
  btnstyle: {
    margin: "8px 0",
  },
})

export const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}))(Button)

export default function LoginForm({
  errorMessage,
}: LoginFormProps): JSX.Element {
  const [username, setUsername] = React.useState<Nullable<string>>(null)
  const [password, setPassword] = React.useState<Nullable<string>>(null)
  const [showReactivate, setShowReactivate] = React.useState<boolean>(false)
  const { login } = useUser()
  const location = useStatefulLocation()
  const history = useHistory()

  const { from } = location.state || { from: { pathname: "/" } }
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [type] = useState<NotificationType["type"]>("error")
  const [message] = useState("Email and/or password entered incorrectly")

  const classes = useStyles()

  const onConfirmReactivation = () => {
    setShowReactivate(false)
    if (username && password) {
      login({ username, password, reactivate: true })
        .then(onLoginSuccess)
        .catch(onLoginFail)
    }
  }

  const onLoginSuccess = () => {
    history.replace(from)
  }

  const onLoginFail = (err: Response) => {
    if (err.status === 409) {
      setShowReactivate(true)
    } else {
      setOpen(true)
      console.error("Login failed:", err)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    if (username && password) {
      login({ username, password }).then(onLoginSuccess).catch(onLoginFail)
    }
  }

  return (
    <Grid>
      <Paper elevation={10} className={classes.paperStyle}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Avatar className={classes.avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Log In </h2>
        </Grid>
        <AbstractModal
          title="Reactivate"
          description="Your account has been paused, would you like to unpause it?"
          isModalOpen={showReactivate}
          handleConfirm={onConfirmReactivation}
          handleCancel={() => setShowReactivate(false)}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <TextField
            label="Email"
            placeholder="Enter email"
            onChange={(e) => setUsername(e.target.value)}
            type="email"
            value={username || ""}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <FormControlLabel
            control={<Checkbox name="checkedB" color="primary" />}
            label="Stay Signed in"
          />
          <ColorButton
            type="submit"
            variant="contained"
            fullWidth
            className={classes.btnstyle}
          >
            Sign In
          </ColorButton>
          <Typography>
            <Link to="/forgotpassword">forgot password</Link>
          </Typography>
          <br />
          <span>{errorMessage}</span>
          <br />
        </form>
      </Paper>
      <Notification
        isOpen={isOpen}
        setisOpen={setOpen}
        handleClose={handleClose}
        type={type}
        message={message}
      />
    </Grid>
  )
}
