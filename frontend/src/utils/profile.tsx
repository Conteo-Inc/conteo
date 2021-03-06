import { useState } from "react"
import { ProfileContentType } from "../components/ProfileContent"
import { Nullable, SetStateDispatch } from "./context"
import * as R from "ramda"

export type ProfileContentSetters = {
  setFirstName: SetStateDispatch<string>
  setLastName: SetStateDispatch<string>
  setBirthDate: SetStateDispatch<Date>
  setGender: SetStateDispatch<string>
  setVideo: SetStateDispatch<Nullable<string>>
  setId: SetStateDispatch<number>
  setInterests: SetStateDispatch<string>
}

// Custom profile hook. This separates saved profile content from edited, unsaved profile content.
export function useProfile(
  content: ProfileContentType
): {
  editableContent: ProfileContentType
  setters: ProfileContentSetters
} {
  const [firstName, setFirstName] = useState<string>(content.first_name)
  const [lastName, setLastName] = useState<string>(content.last_name)
  const [birthDate, setBirthDate] = useState<Date>(content.birth_date)
  const [gender, setGender] = useState<string>(content.gender)
  const [interests, setInterests] = useState<string>(content.interests)
  const [video, setVideo] = useState<Nullable<string>>(content.video)
  const [id, setId] = useState<number>(content.id)

  const editableContent: ProfileContentType = {
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    gender: gender,
    interests: interests,
    video: video,
    id: id,
  }

  const setters: ProfileContentSetters = {
    setFirstName,
    setLastName,
    setBirthDate,
    setGender,
    setInterests,
    setVideo,
    setId,
  }

  return { editableContent, setters }
}

type ProfileContentStrings = Omit<ProfileContentType, "birth_date"> & {
  birth_date: string
}
function toDateString(date: Date): string {
  //Month is zero-indexed in Typescript
  const month = (date.getMonth() + 1) % 12
  return `${date.getFullYear()}-${month}-${date.getDay()}`
}

export function getUpdates(
  original: ProfileContentType,
  updated: ProfileContentType
): ProfileContentStrings {
  const comparator = (canon: string, other: string): Nullable<string> => {
    return canon === other ? canon : other === "" ? null : other
  }
  const canon: ProfileContentStrings = {
    ...original,
    birth_date: toDateString(original.birth_date),
  }
  const other: ProfileContentStrings = {
    ...updated,
    birth_date: toDateString(updated.birth_date),
  }

  const result: ProfileContentStrings = R.mergeWith(comparator, canon, other)
  return result
}
