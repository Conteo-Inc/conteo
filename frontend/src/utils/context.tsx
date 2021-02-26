import * as React from "react"

export type Nullable<T> = T | null
export type NullableId = Nullable<number>

export type User = Record<string, unknown>

type ContextValueType<T> = [
  Nullable<T>,
  React.Dispatch<React.SetStateAction<Nullable<T>>>
]

// Define the type so that createContext understands what to expect for focusedUser
type AppContextType = {
  user: ContextValueType<User>
  focusedUser: ContextValueType<number>
}

function createContextValueType<T>(): ContextValueType<T> {
  return [null, () => {}] // eslint-disable-line
}

// Even though this is initialized as null, using it will supply the correct type
export const AppContext = React.createContext<AppContextType>({
  user: createContextValueType<User>(),
  focusedUser: createContextValueType<number>(),
})

//This is gross, but we need to explicitly get just focusedUser
export default function useFocusedUser(): AppContextType["focusedUser"] {
  const context = React.useContext(AppContext)
  return context.focusedUser
}

export function useUser(): AppContextType["user"] {
  const context = React.useContext(AppContext)
  return context.user
}
