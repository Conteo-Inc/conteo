import { Button, Grid, makeStyles, Typography } from "@material-ui/core"
import * as React from "react"
import { useHistory } from "react-router-dom"
import { useUser } from "../utils/context"

const useStyles = makeStyles({
  header: {
    backgroundColor: "#cd0b2d",
    height: "3rem",
    padding: "0 1rem",
    position: "fixed",
    left: 0,
    top: 0,
  },
  bannerText: {
    color: "white",
  },
})

export default function AppHeader(): JSX.Element {
  const classes = useStyles()
  const { logout, user } = useUser()
  const history = useHistory()

  const name = user
    ? user.first_name === ""
      ? user.email
      : user.first_name
    : ""

  return (
    <Grid
      container
      item
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.header}
      wrap="nowrap"
    >
      <Grid item xs={2}>
        <Typography variant="h5" className={classes.bannerText}>
          {/* TODO: Replace if profile exists */}
          {`Hi ${name}`}
        </Typography>
      </Grid>
      {/* Figure out sizes */}
      <Grid
        xs={3}
        item
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Typography className={classes.bannerText}>{"About"}</Typography>
        <Typography className={classes.bannerText}>{"Contact Us"}</Typography>
        <Typography className={classes.bannerText}>{"Help"}</Typography>
        <Button onClick={() => logout().then(() => history.push("/"))}>
          <Typography className={classes.bannerText}>{"Log Out"}</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}
