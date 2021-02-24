import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LinkItem from "./components/LinkItem"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import { Box, Grid, makeStyles, Typography } from "@material-ui/core"
import RecordPage from "./FullPageRoutes/RecordPage"
import VideoListPage from "./FullPageRoutes/VideoListPage"
import { AppContext, NullableId } from "./utils/context"
import Help from "./FullPageRoutes/Help"
import ContactUs from "./FullPageRoutes/ContactUs"

const useStyles = makeStyles({
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
  app: {
    height: "40rem",
    display: "flex",
    flexDirection: "column",
  },
})

//@TODO: Move links to common file
function MainPage() {
  return (
    <ul>
      <LinkItem to="/Tokens" text="Tokens" />
      <LinkItem to="/Record" text="Record" />
      <LinkItem to="/Watch" text="Watch" />
      <LinkItem to="/Profile" text="Profile" />
      <LinkItem to="/Help" text="Help" />
      <LinkItem to="/ContactUS" text="ContactUs" />
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
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.header}
        >
          <Typography variant="h5" className={classes.bannerText}>
            {"Hi, Jane"}
          </Typography>
          {/* Figure out sizes */}
          <Grid item lg={2} sm={2} xs={2}>
            <Grid container direction="row" justify="space-between">
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
        </Grid>
        {/* Here's where the body of the App will live */}
        <Box className={classes.app}>
          <Switch>
            <Route path="/Tokens">
              <TokenPage />
            </Route>
            <Route path="/Record">
              <RecordPage />
            </Route>
            <Route path="/Watch">
              <VideoListPage />
            </Route>
            <Route path="/Profile">
              <ProfilePage />
            </Route>
            <Route path="/">
              <MainPage />
            </Route>
          </Switch>
        </Box>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-end"
          className={classes.footer}
        >
          <Grid item lg={2}>
            <Grid container direction="row" justify="space-between">
              <Typography className={classes.bannerText}>
                {"Privacy Policy"}
              </Typography>
              <Typography className={classes.bannerText}>
                {"Terms of Service"}
              </Typography>
            </Grid>
          </Grid>
          <Typography className={classes.bannerText}>
            {"Copyright 2020"}
          </Typography>
        </Grid>
      </Router>
    </AppContext.Provider>
  )
}

const container = document.getElementById("app")
render(<App />, container)
