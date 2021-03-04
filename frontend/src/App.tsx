import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LinkItem from "./components/LinkItem"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import { Box, makeStyles } from "@material-ui/core"
import RecordPage from "./FullPageRoutes/RecordPage"
import ProvideContext from "./components/utils/ProvideContext"
import AppHeader from "./components/AppHeader"
import AppFooter from "./components/AppFooter"
import { ProtectedRoute } from "./components/ProtectedRoute"

const useStyles = makeStyles({
  app: {
    height: "40rem",
    display: "flex",
    flexDirection: "column",
    paddingTop: "50px",
  },
})

//@TODO: Move links to common file
function MainPage() {
  return (
    <ul>
      <LinkItem to="/record" text="Record" />
      <LinkItem to="/profile" text="Profile" />
    </ul>
  )
}

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
            <ProtectedRoute path="/record">
              <RecordPage />
            </ProtectedRoute>
            <ProtectedRoute path="/profile">
              <ProfilePage />
            </ProtectedRoute>
            <ProtectedRoute path="/">
              <MainPage />
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
