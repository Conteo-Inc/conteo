import * as React from "react"
import { useLocation } from "react-router-dom"
import { parseIdentity, request } from "./fetch"
import { Location } from "history"
import type { HttpResponse } from "./fetch"

export type Nullable<T> = T | null
export type NullableId = Nullable<number>

export type User = {
  email: string
  first_name: string
}

export type UserAuth = {
  logged_in: Nullable<boolean>
  user: Nullable<User>
}
export type AuthInformation = {
  username: string
  password: string
  reactivate?: boolean
}
export type SetStateDispatch<T> = React.Dispatch<React.SetStateAction<T>>

export type CallBack = () => void

// Define the type so that createContext understands what to expect for focusedUser
type AppContextType = {
  user: [UserAuth, SetStateDispatch<UserAuth>]
  focusedUser: [NullableId, SetStateDispatch<NullableId>]
}

// Even though this is initialized as null, using it will supply the correct type
export const AppContext = React.createContext<AppContextType>({
  user: [{ logged_in: null, user: null }, () => {}], // eslint-disable-line
  focusedUser: [null, () => {}], // eslint-disable-line
})

//This is gross, but we need to explicitly get just focusedUser
export default function useFocusedUser(): AppContextType["focusedUser"] {
  const context = React.useContext(AppContext)
  return context.focusedUser
}

type UseUserReturnType = {
  user: Nullable<User>
  logged_in: Nullable<boolean>
  register: (authInfo: AuthInformation) => Promise<void>
  login: (authInfo: AuthInformation) => Promise<HttpResponse<Response>>
  logout: () => Promise<void>
}
export function useUser(): UseUserReturnType {
  const context = React.useContext(AppContext)
  const [{ logged_in, user }, setUser] = context.user

  const register = (authInfo: AuthInformation): Promise<void> => {
    return request({
      path: "/api/register/",
      method: "post",
      body: authInfo,
    }).then(() => {
      //TODO: replace with response
      setUser({
        logged_in: true,
        user: {
          email: "foo",
          first_name: "foo",
        },
      })
    })
  }

  const login = (
    authInfo: AuthInformation
  ): Promise<HttpResponse<Response>> => {
    return request({
      path: "/api/login/",
      method: "post",
      body: authInfo,
      parser: parseIdentity,
    }).then((resp) => {
      setUser({
        logged_in: true,
        user: {
          email: "foo",
          first_name: "foo",
        },
      })
      return resp
    })
  }

  const logout = (): Promise<void> => {
    return request({
      path: "/api/logout/",
      method: "post",
      parser: parseIdentity,
    }).then(() => {
      setUser({ logged_in: false, user: null })
    })
  }

  return { user, logged_in, register, login, logout }
}

type LocationState = {
  from: Location
}
export function useStatefulLocation(): Location<LocationState> {
  const location = useLocation<LocationState>()
  return location
}
