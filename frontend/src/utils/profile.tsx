import { useState } from "react"
import { ProfileContentType } from "../components/ProfileContent"
import { Nullable, SetStateDispatch } from "./context"

export type ProfileContentSetters = {
  setUsername: SetStateDispatch<string>
  setFirstName: SetStateDispatch<string>
  setLastName: SetStateDispatch<string>
  setBirthday: SetStateDispatch<Date>
  setGender: SetStateDispatch<string>
  setVideo: SetStateDispatch<Nullable<string>>
  setId: SetStateDispatch<number>
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
  const [video, setVideo] = useState<Nullable<string>>(content.video)
  const [id, setId] = useState<number>(content.id)

  const editableContent: ProfileContentType = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    birthday: birthday,
    gender: gender,
    video: video,
    id: id,
  }

  const setters: ProfileContentSetters = {
    setUsername,
    setFirstName,
    setLastName,
    setBirthday,
    setGender,
    setVideo,
    setId,
  }

  return { editableContent, setters }
}
