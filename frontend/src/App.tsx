import * as React from "react"
import { render } from "react-dom"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import TokenPage from "./FullPageRoutes/TokenPage"
import ProfilePage from "./FullPageRoutes/Profile"
import PrivacySettings from "./FullPageRoutes/PrivacySettings"
import MatchingPage from "./FullPageRoutes/Matching"
import { Box, makeStyles, Grid } from "@material-ui/core"
import RecordPage from "./FullPageRoutes/RecordPage"
import ProvideContext from "./components/utils/ProvideContext"
import AppHeader from "./components/core/AppHeader"
import AppFooter from "./components/core/AppFooter"
import AppSideBar from "./components/core/AppSidebar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import MailPage from "./FullPageRoutes/MailPage"
import VideoViewPage from "./FullPageRoutes/VideoViewPage"
import Help from "./FullPageRoutes/Help"
import ContactUs from "./FullPageRoutes/ContactUs"
import AccountsPage from "./FullPageRoutes/AccountsPage"
import ForgotPassword from "./FullPageRoutes/ForgotPassword"
import ResetPassword from "./FullPageRoutes/ResetPassword"

const useStyles = makeStyles({
  app: {
    minHeight: "38rem",
    display: "flex",
    flexDirection: "column",
    padding: "3rem 0",
    backgroundColor: "#ede8db",
  },
  appRoot: {
    minHeight: "55rem",
  },
  appBody: {
    minHeight: "49rem",
    width: "100%",
  },
  sidebar: {
    borderRight: "1px solid white",
  },
})

type Page = {
  path: string
  pageJsx: JSX.Element
}

export default function App(): JSX.Element {
  const classes = useStyles()

  const pageList: Page[] = [
    {
      path: "/record/:receiver",
      pageJsx: <RecordPage />,
    },
    {
      path: "/matches/",
      pageJsx: <MatchingPage />,
    },
    {
      path: "/profile/",
      pageJsx: <ProfilePage />,
    },
    {
      path: "/privacy/",
      pageJsx: <PrivacySettings />,
    },
    {
      path: "/watch/",
      pageJsx: <VideoViewPage />,
    },
    {
      path: "/help/",
      pageJsx: <Help />,
    },
    {
      path: "/contact/",
      pageJsx: <ContactUs />,
    },
    {
      path: "/accounts/",
      pageJsx: <AccountsPage />,
    },
    {
      path: "/",
      pageJsx: <MailPage />,
    },
  ]

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
            <Route path="/verification/:uidb64/:token">
              <ResetPassword />
            </Route>
            {pageList.map(({ path, pageJsx }: Page, index: number) => (
              <ProtectedRoute key={`page-${index}`} path={path}>
                <Grid container direction="row">
                  <Grid item className={classes.sidebar} xs={2}>
                    <AppSideBar />
                  </Grid>
                  <Grid item xs={10}>
                    {pageJsx}
                  </Grid>
                </Grid>
              </ProtectedRoute>
            ))}
          </Switch>
        </Box>
        <AppFooter />
      </Router>
    </ProvideContext>
  )
}

const container = document.getElementById("app")
render(<App />, container)
