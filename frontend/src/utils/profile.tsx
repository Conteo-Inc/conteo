import { useState } from "react"
import { ProfileContentType } from "../components/ProfileContent"
import { SetStateDispatch } from "./context"

export type ProfileContentSetters = {
  setUsername: SetStateDispatch<string>
  setFirstName: SetStateDispatch<string>
  setLastName: SetStateDispatch<string>
  setBirthday: SetStateDispatch<Date>
  setGender: SetStateDispatch<string>
}

// Custom profile hook. This separates saved profile content from edited, unsaved profile content.
export function useProfile(
  content: ProfileContentType
): {
  editableContent: ProfileContentType
  setters: ProfileContentSetters
} {
  const [username, setUsername] = useState<string>(content.username)
  const [firstName, setFirstName] = useState<string>(content.firstName)
  const [lastName, setLastName] = useState<string>(content.lastName)
  const [birthday, setBirthday] = useState<Date>(content.birthday)
  const [gender, setGender] = useState<string>(content.gender)

  const editableContent: ProfileContentType = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    gender: gender,
  }

  const setters: ProfileContentSetters = {
    setUsername,
    setFirstName,
    setLastName,
    setBirthday,
    setGender,
  }

  return { editableContent, setters }
}
