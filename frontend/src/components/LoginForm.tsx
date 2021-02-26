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
  Link as MuiLink,
} from "@material-ui/core"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { red } from "@material-ui/core/colors"
import { Link } from "react-router-dom"

export type UserHandlerArgs = {
  username: string | null
  password: string | null
}
type LoginFormProps = {
  handle_login: ({ username, password }: UserHandlerArgs) => void
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
    color: "#fff",
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
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
  handle_login,
  errorMessage,
}: LoginFormProps): JSX.Element {
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
            <LockOutlinedIcon />
          </Avatar>
          <h2>Log In </h2>
        </Grid>
        <form>
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className={classes.btnstyle}
            component={Link}
            to="/"
            onClick={() => handle_login({ username, password })}
          >
            Sign In
          </Button>
          <Typography>
            <MuiLink href="#">Forgot password</MuiLink>
          </Typography>
          <br />
          <span>{errorMessage}</span>
          <br />
        </form>
      </Paper>
    </Grid>
  )
}
