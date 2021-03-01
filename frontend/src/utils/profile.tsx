import { useState } from "react"
import { ProfileContentType } from "../components/ProfileContent"
import { Nullable } from "./context"

export type ProfileContentSetters = {
  setUsername: React.Dispatch<React.SetStateAction<string>>
  setFirstName: React.Dispatch<React.SetStateAction<string>>
  setLastName: React.Dispatch<React.SetStateAction<string>>
  setBirthday: React.Dispatch<React.SetStateAction<Date>>
  setGender: React.Dispatch<React.SetStateAction<string>>
  setVideo: React.Dispatch<React.SetStateAction<Nullable<string>>>
  setId: React.Dispatch<React.SetStateAction<number>>
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
