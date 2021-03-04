import * as React from "react"
import LoginForm, { ColorButton } from "../components/LoginForm"
import SignupForm from "../components/SignupForm"
import { Grid, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  paperStyle: {
    padding: 20,
    width: 280,
    margin: "20px auto",
  },
  btnStyle: {
    margin: "8px 0",
  },
})

export default function TokenPage(): JSX.Element {
  const [displayedForm, setDisplayedForm] = React.useState<string | null>(null)
  const [errMessage, seterrMessage] = React.useState<string | null>(null)
  const classes = useStyles()

  React.useEffect(() => {
    seterrMessage(null)
  }, [displayedForm])

  const display_form = (form: string) => {
    setDisplayedForm(form)
  }

  return (
    <>
      {displayedForm === "signup" ? (
        <SignupForm errorMessage={errMessage} />
      ) : (
        <Grid container>
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
            <LoginForm errorMessage={errMessage} />
          </Grid>
        </Grid>
      )}
    </>
  )
}
