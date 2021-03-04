import * as React from "react"
import { AppContext, NullableId, User, UserAuth } from "../../utils/context"
import { request } from "../../utils/fetch"

type ProvideContextProps = {
  children: React.ReactNode
}
export default function ProvideContext({
  children,
}: ProvideContextProps): JSX.Element {
  const [userValue, setUserValue] = React.useState<UserAuth>({
    logged_in: null,
    user: null,
  })
  const focusedUserValue = React.useState<NullableId>(null)

  React.useEffect(() => {
    if (userValue.logged_in === null) {
      request<User>({
        path: "/api/user/",
        method: "get",
      })
        .then((res) => {
          setUserValue({ logged_in: true, user: res.parsedBody })
        })
        .catch(() => {
          setUserValue({ ...userValue, logged_in: false })
        })
    }
  })

  return (
    <AppContext.Provider
      value={{ user: [userValue, setUserValue], focusedUser: focusedUserValue }}
    >
      {children}
    </AppContext.Provider>
  )
}
