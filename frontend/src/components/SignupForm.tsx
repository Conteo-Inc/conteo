import * as React from "react"
import { UserHandlerArgs, useStyles, ColorButton } from "./LoginForm"
import {
  Avatar,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Link,
} from "@material-ui/core"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"

type SignupFormProps = {
  handle_signup: ({ e, username, password }: UserHandlerArgs) => void
  errorMessage: string | null
}
export default function SignupForm({
  handle_signup,
  errorMessage,
}: SignupFormProps) {
  const [username, setUsername] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState<string | null>(null)

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
        <form onSubmit={(e) => handle_signup({ e, username, password })}>
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
