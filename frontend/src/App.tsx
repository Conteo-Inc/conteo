import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LinkItem from "./components/LinkItem"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import Dashboard from "./FullPageRoutes/Dashboard"
import { AppContext, NullableId } from "./utils/context"
import VideoListPage from "./FullPageRoutes/VideoListPage"
import RecordPage from "./FullPageRoutes/RecordPage"

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
    width: "100%",
  },
})

//@TODO: Move links to common file
function MainPage() {
  return (
    <ul>
      <LinkItem to="/tokens" text="Tokens" />
      <LinkItem to="/record" text="Record" />
      <LinkItem to="/watch" text="Watch" />
      <LinkItem to="/profile" text="Profile" />
      <LinkItem to="/dashboard" text="Dashboard" />
    </ul>
  )
}

export default function App(): JSX.Element {
  const classes = useStyles()
  return (
    <AppContext.Provider
      //@TODO: Handle default better or ensure change before use
      value={{ focusedUser: React.useState<NullableId>(null) }}
    >
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
              <Typography className={classes.bannerText}>
                {"Log Out"}
              </Typography>
            </Grid>
          </Grid>
          {/* Here's where the body of the App will live */}
          <Grid item container direction="row" className={classes.appBody}>
            {/* Switch needs to be wrapped in a div to inherit the css */}
            <div className={classes.appBody} id="foo">
              <Switch>
                <Route path="/tokens">
                  <TokenPage />
                </Route>
                <Route path="/profile">
                  <ProfilePage />
                </Route>
                <Route path="/record">
                  <RecordPage />
                </Route>
                <Route path="/watch">
                  <VideoListPage />
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/">
                  <MainPage />
                </Route>
              </Switch>
            </div>
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
            <Grid item container xs={1} alignContent="flex-end">
              <Typography className={classes.bannerText}>
                {"Copyright 2020"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Router>
    </AppContext.Provider>
  )
}

// export default App;

const container = document.getElementById("app")
render(<App />, container)
