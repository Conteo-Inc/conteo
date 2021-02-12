import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LinkItem from "./components/LinkItem"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import Dashboard from "./FullPageRoutes/Dashboard"

const useStyles = makeStyles({
  appRoot: {
    minHeight: "55rem",
  },
  header: {
    backgroundColor: "#cd0b2d",
    height: "3rem",
    padding: "0 1rem",
  },
  footer: {
    backgroundColor: "#760000",
    height: "3rem",
    padding: "0 1rem",
  },
  bannerText: {
    color: "white",
  },
  appBody: {
    minHeight: "49rem",
  },
})

//@TODO: Move links to common file
function MainPage() {
  return (
    <ul>
      <LinkItem to="/Tokens" text="Tokens" />
      <LinkItem to="/Profile" text="Profile" />
      <LinkItem to="/Dashboard" text="Dashboard" />
    </ul>
  )
}

export default function App(): JSX.Element {
  const classes = useStyles()
  return (
    <Router>
      <Grid container direction="column" className={classes.appRoot}>
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
              {"Hi, Jane"}
            </Typography>
          </Grid>
          <Grid item container direction="row" justify="space-between" xs={3}>
            <Typography className={classes.bannerText}>{"About"}</Typography>
            <Typography className={classes.bannerText}>
              {"Contact Us"}
            </Typography>
            <Typography className={classes.bannerText}>{"Help"}</Typography>
            <Typography className={classes.bannerText}>{"Log Out"}</Typography>
          </Grid>
        </Grid>
        {/* Here's where the body of the App will live */}
        <Grid item container direction="row" className={classes.appBody}>
          <Switch>
            <Route path="/Tokens">
              <TokenPage />
            </Route>
            <Route path="/Profile">
              <ProfilePage />
            </Route>
            <Route path="/Dashboard">
              <Dashboard />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
          </Switch>
        </Grid>
        <Grid
          container
          item
          direction="row"
          justify="space-between"
          alignItems="flex-end"
          className={classes.footer}
        >
          <Grid container item xs={2} direction="row" justify="space-between">
            <Typography className={classes.bannerText}>
              {"Privacy Policy"}
            </Typography>
            <Typography className={classes.bannerText}>
              {"Terms of Service"}
            </Typography>
          </Grid>
          <Grid item xs={1} alignItems="flex-end">
            <Typography className={classes.bannerText}>
              {"Copyright 2020"}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Router>
  )
}

// export default App;

const container = document.getElementById("app")
render(<App />, container)
