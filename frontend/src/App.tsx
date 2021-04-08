import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import MatchingPage from "./FullPageRoutes/Matching"
import { Box, makeStyles } from "@material-ui/core"
import RecordPage from "./FullPageRoutes/RecordPage"
import ProvideContext from "./components/utils/ProvideContext"
import AppHeader from "./components/AppHeader"
import AppFooter from "./components/AppFooter"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Dashboard from "./FullPageRoutes/Dashboard"
import VideoViewPage from "./FullPageRoutes/VideoViewPage"
import Help from "./FullPageRoutes/Help"
import ContactUs from "./FullPageRoutes/ContactUs"
import AccountsPage from "./FullPageRoutes/AccountsPage"
import ForgotPassword from "./FullPageRoutes/ForgotPassword"
import ResetPassword from "./FullPageRoutes/ResetPassword"

const useStyles = makeStyles({
  app: {
    minHeight: "40rem",
    display: "flex",
    flexDirection: "column",
    paddingTop: "50px",
  },
  appRoot: {
    minHeight: "55rem",
  },
  appBody: {
    minHeight: "49rem",
    width: "100%",
  },
})

export default function App(): JSX.Element {
  const classes = useStyles()

  return (
    <ProvideContext>
      <Router>
        <AppHeader />
        <Box className={classes.app}>
          <Switch>
            <Route path="/tokens">
              <TokenPage />
            </Route>
            <Route path="/forgotpassword">
              <ForgotPassword />
            </Route>
            <Route path="/resetpassword">
              <ResetPassword />
            </Route>
            <ProtectedRoute path="/record/:receiver">
              <RecordPage />
            </ProtectedRoute>
            <ProtectedRoute path="/matches">
              <MatchingPage />
            </ProtectedRoute>
            <ProtectedRoute path="/profile">
              <ProfilePage />
            </ProtectedRoute>
            <ProtectedRoute path="/watch">
              <VideoViewPage />
            </ProtectedRoute>
            <ProtectedRoute path="/help">
              <Help />
            </ProtectedRoute>
            <ProtectedRoute path="/contact">
              <ContactUs />
            </ProtectedRoute>
            <ProtectedRoute path="/accounts">
              <AccountsPage />
            </ProtectedRoute>
            <ProtectedRoute path="/">
              <Dashboard />
            </ProtectedRoute>
          </Switch>
        </Box>
        <AppFooter />
      </Router>
    </ProvideContext>
  )
}

const container = document.getElementById("app")
render(<App />, container)
