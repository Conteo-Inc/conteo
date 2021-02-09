import * as React from "react"
import LoginForm, {
  UserHandlerArgs,
  ColorButton,
} from "../components/LoginForm"
import SignupForm from "../components/SignupForm"
import Dashboard from "../components/Dashboard"
import { HttpResponse, request } from "../utils/fetch"
import { Grid, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

type TokenResponse = {
  username: string
  token: string
}

type NavProps = {
  logged_in: boolean
  display_form: (form: string) => void
  handle_logout: () => void
}

function handleErrors(response: HttpResponse<TokenResponse>) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

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

export default function TokenPage() {
  const [displayedForm, setDisplayedForm] = React.useState<string | null>(null)
  const [logged_in, setLoggedIn] = React.useState<boolean>(
    localStorage.getItem("token") ? true : false
  )
  const [email, setEmail] = React.useState<string | null>(null)
  const [errMessage, seterrMessage] = React.useState<string | null>(null)
  const classes = useStyles()

  React.useEffect(() => {
    seterrMessage(null)
  }, [displayedForm, logged_in])

  const handle_login = ({ e, errorMessage, ...data }: UserHandlerArgs) => {
    e.preventDefault()
    request<TokenResponse>("/api/login/", "post", false, true, data)
      .then(handleErrors)
      .then((json) => {
        // FIXME: json.parsedBody can be undefined; this needs to be handled gracefully!
        if (json.parsedBody) {
          localStorage.setItem("token", json.parsedBody.token)
          setLoggedIn(true)
          setEmail(json.parsedBody.username)
          setDisplayedForm(null)
          seterrMessage(null)
        } else {
          console.error(
            "FIXME: json.parsedBody was undefined and so the login failed. \
            This is a problem with the code that needs to be addressed"
          )
        }
      })
      .catch((error) => {
        seterrMessage("Incorrect email or password") // Set error message based on error type
      })
  }

  const handle_signup = ({ e, errorMessage, ...data }: UserHandlerArgs) => {
    e.preventDefault()
    request<TokenResponse>("/api/register/", "post", false, true, data)
      .then(handleErrors)
      .then((resp) => {
        // FIXME: resp.parsedBody can be undefined; this needs to be handled gracefully!
        if (resp.parsedBody) {
          localStorage.setItem("token", resp.parsedBody.token)
          setLoggedIn(true)
          setDisplayedForm(null)
          setEmail(resp.parsedBody.username)
        } else {
          console.error(
            "FIXME: resp.parsedBody was undefined and so the login failed. \
            This is a problem with the code that needs to be addressed"
          )
        }
      })
      .catch((error) => {
        seterrMessage("Incorrect email or password") // Set error message based on error type later
      })
  }

  const handle_logout = () => {
    localStorage.removeItem("token")
    setLoggedIn(false)
    setEmail(null)
  }

  const display_form = (form: string) => {
    setDisplayedForm(form)
  }

  return (
    <>
      {logged_in === true ? (
        <Dashboard handle_logout={handle_logout} email={email} />
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
