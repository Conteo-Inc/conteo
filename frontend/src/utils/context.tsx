import * as React from "react"

export type Nullable<T> = T | null
export type NullableId = Nullable<number>

// Define the type so that createContext understands what to expect for focusedUser
type AppContextType = {
  focusedUser: [
    NullableId,
    Nullable<React.Dispatch<React.SetStateAction<NullableId>>>
  ]
}

// Even though this is initialized as null, using it will supply the correct type
export const AppContext = React.createContext<AppContextType>({
  focusedUser: [null, null],
})

//This is gross, but we need to explicitly get just focusedUser
export default function useFocusedUser(): AppContextType["focusedUser"] {
  const context = React.useContext(AppContext)
  return context.focusedUser
}
