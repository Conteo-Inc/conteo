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

  const classes = useStyles()

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
          onSubmit={() =>
            username &&
            password &&
            register({ username, password }, () => {
              history.replace(from)
            })
          }
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
    </Grid>
  )
}
