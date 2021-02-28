import * as React from "react"
import LoginForm, {
  UserHandlerArgs,
  ColorButton,
} from "../components/LoginForm"
import SignupForm from "../components/SignupForm"
import { parseIdentity, request } from "../utils/fetch"
import { Grid, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Dashboard from "../FullPageRoutes/Dashboard"

const useStyles = makeStyles({
  paperStyle: {
    padding: 20,
    width: 280,
    margin: "20px auto",
  },
  btnStyle: {
    margin: "8px 0",
  },
  pageStyle: {
    margin: "100px auto",
  },
})

export default function TokenPage(): JSX.Element {
  const [displayedForm, setDisplayedForm] = React.useState<string | null>(null)
  const [logged_in, setLoggedIn] = React.useState<boolean>(false)
  const [errMessage, seterrMessage] = React.useState<string | null>(null)
  const classes = useStyles()

  React.useEffect(() => {
    seterrMessage(null)
  }, [displayedForm, logged_in])

  const handle_login = ({ e, ...data }: UserHandlerArgs) => {
    e.preventDefault()
    request({
      path: "/api/login/",
      method: "post",
      body: data,
      parser: parseIdentity,
    }).then(() => {
      setLoggedIn(true)
      setDisplayedForm(null)
      seterrMessage(null)
    })
  }

  const handle_signup = ({ e, ...data }: UserHandlerArgs) => {
    e.preventDefault()
    request({
      path: "/api/register/",
      method: "post",
      body: data,
      parser: parseIdentity,
    }).then(() => {
      setLoggedIn(true)
      setDisplayedForm(null)
    })
  }

  const display_form = (form: string) => {
    setDisplayedForm(form)
  }

  return (
    <>
      {logged_in === true ? (
        <Dashboard />
      ) : displayedForm === "signup" ? (
        <SignupForm handle_signup={handle_signup} errorMessage={errMessage} />
      ) : (
        <Grid container className={classes.pageStyle}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            item
            sm
          >
            <Paper className={classes.paperStyle}>
              <ColorButton
                type="submit"
                variant="contained"
                fullWidth
                className={classes.btnStyle}
                onClick={() => {
                  display_form("signup")
                }}
              >
                Sign Up
              </ColorButton>
            </Paper>
          </Grid>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            item
            sm
          >
            <LoginForm handle_login={handle_login} errorMessage={errMessage} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
