import * as React from "react"
import { Route, Redirect, RouteProps } from "react-router-dom"
import LoadingPage from "../FullPageRoutes/LoadingPage"
import { AppContext, useStatefulLocation } from "../utils/context"

type ProtectedRouteProps = RouteProps

export function ProtectedRoute({
  children,
  ...rest
}: ProtectedRouteProps): JSX.Element {
  const {
    user: [userValue],
  } = React.useContext(AppContext)
  const location = useStatefulLocation()

  return (
    <Route {...rest}>
      {userValue.logged_in === true ? (
        children
      ) : userValue.logged_in === false ? (
        <Redirect to={{ pathname: "/tokens", state: { from: location } }} />
      ) : (
        <LoadingPage />
      )}
    </Route>
  )
}
