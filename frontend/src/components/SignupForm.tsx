import * as React from "react"
import { useStyles, ColorButton } from "./LoginForm"
import {
  Avatar,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import { useHistory } from "react-router-dom"
import { useStatefulLocation, useUser } from "../utils/context"
import AbstractModal from "./AbstractModal"

type SignupFormProps = {
  errorMessage: string | null
}
export default function SignupForm({
  errorMessage,
}: SignupFormProps): JSX.Element {
  const [username, setUsername] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState<string | null>(null)
  const history = useHistory()
  const location = useStatefulLocation()
  const { register } = useUser()
  const { from } = location.state || { from: { pathname: "/" } }
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)

  const classes = useStyles()

  const handleConfirm = () => {
    if (username && password) {
      register({ username, password }).then(() => {
        setIsModalOpen(false)
        history.replace(from)
      })
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
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
            <AccountCircleIcon />
          </Avatar>
          <h2>Sign Up </h2>
        </Grid>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsModalOpen(true)
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
            Sign Up
          </ColorButton>
          <br />
          <span>{errorMessage}</span>
          <br />
        </form>
      </Paper>
      <AbstractModal
        isModalOpen={isModalOpen}
        handleConfirm={handleConfirm}
        handleCancel={handleClose}
        title="Confirmation"
        description={`Are you sure you are 18+`}
      />
    </Grid>
  )
}
