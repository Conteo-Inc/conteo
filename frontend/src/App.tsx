import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import LinkItem from "./components/LinkItem"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core"
import RecordPage from "./FullPageRoutes/RecordPage"
import VideoListPage from "./FullPageRoutes/VideoListPage"
import {
  AppContext,
  Nullable,
  NullableId,
  User,
  useUser,
} from "./utils/context"
import { parseIdentity, request } from "./utils/fetch"

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
      <LinkItem to="/login" text="Tokens" />
      <LinkItem to="/Record" text="Record" />
      <LinkItem to="/Watch" text="Watch" />
      <LinkItem to="/Profile" text="Profile" />
    </ul>
  )
}

function AppWrapper(): JSX.Element {
  return (
    <AppContext.Provider
      value={{
        user: React.useState<Nullable<User>>(null),
        focusedUser: React.useState<NullableId>(null),
      }}
    >
      <App />
    </AppContext.Provider>
  )
}

export default function App(): JSX.Element {
  const classes = useStyles()
  //This could be problematic because it's defined before AppContext.Provider
  const [user, setUser] = useUser()

  const logout = () => {
    request({
      path: "/api/logout",
      method: "post",
      parser: parseIdentity,
    }).then(() => {
      setUser(null)
    })
  }

  React.useEffect(() => {
    //figure out if we're logged in
  }, [])

  return (
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
            <Button component={Link} to="/" onClick={() => logout()}>
              <Typography className={classes.bannerText}>
                {"Log Out"}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* Here's where the body of the App will live */}
      <Box className={classes.app}>
        {user ? (
          <Switch>
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
        ) : (
          <Switch>
            <Route path="/">
              <TokenPage />
            </Route>
          </Switch>
        )}
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
  )
}

const container = document.getElementById("app")
render(<AppWrapper />, container)
