import { Button, Grid, makeStyles, Typography } from "@material-ui/core"
import * as React from "react"
import { useHistory } from "react-router-dom"
import { useUser } from "../../utils/context"

const useStyles = makeStyles({
  header: {
    backgroundColor: "#cd0b2d",
    height: "3rem",
    padding: "0 1rem",
    position: "fixed",
    left: "0px",
    top: "0px",
  },
  bannerText: {
    color: "white",
    textTransform: "none",
  },
})

export default function AppHeader(): JSX.Element {
  const classes = useStyles()
  const { logout, user, logged_in } = useUser()
  const history = useHistory()

  const welcome = !logged_in
    ? "Welcome"
    : user
      ? user.first_name === ""
        ? `Hi ${user.email}`
        : `Hi ${user.first_name}`
      : ""

  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={classes.header}
    >
      <Grid item>
        <Typography variant="h5" className={classes.bannerText}>
          {welcome}
        </Typography>
      </Grid>
      <Grid item>
        {logged_in && (
          <Button onClick={() => logout().then(() => history.push("/"))}>
            <Typography className={classes.bannerText}>{"Log Out"}</Typography>
          </Button>
        )}
      </Grid>
    </Grid>
  )
}
