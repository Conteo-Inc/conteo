import { useState } from "react"
import type { ProfileContentType } from "../components/profile/ProfileContent"
import type {
  PrivacySettingsType,
  PrivacySetting,
} from "../components/profile/PrivacySettings"
import { Nullable, SetStateDispatch } from "./context"
import * as R from "ramda"

export type ProfileComponentStates = {
  isBioActive: boolean
  isPrivacyActive: boolean
  isNotificationsActive: boolean
  isSettingsActive: boolean
  isContactUsActive: boolean
}

export type ProfileComponentSetters = {
  setIsBioActive: React.Dispatch<React.SetStateAction<boolean>>
  setIsPrivacyActive: React.Dispatch<React.SetStateAction<boolean>>
  setIsNotificationsActive: React.Dispatch<React.SetStateAction<boolean>>
  setIsSettingsActive: React.Dispatch<React.SetStateAction<boolean>>
  setIsContactUsActive: React.Dispatch<React.SetStateAction<boolean>>
}

// Provides the profile page with states for each of its components.
// When a component is selected from the sidebar, its state will be updated
// to true and the previous component's state to false.
export function useProfileComponents(): {
  componentStates: ProfileComponentStates
  componentSetters: ProfileComponentSetters
} {
  const [isBioActive, setIsBioActive] = useState<boolean>(true)
  const [isPrivacyActive, setIsPrivacyActive] = useState<boolean>(false)
  const [isNotificationsActive, setIsNotificationsActive] = useState<boolean>(
    false
  )
  const [isSettingsActive, setIsSettingsActive] = useState<boolean>(false)
  const [isContactUsActive, setIsContactUsActive] = useState<boolean>(false)

  const componentStates: ProfileComponentStates = {
    isBioActive: isBioActive,
    isPrivacyActive: isPrivacyActive,
    isNotificationsActive: isNotificationsActive,
    isSettingsActive: isSettingsActive,
    isContactUsActive: isContactUsActive,
  }

  const componentSetters: ProfileComponentSetters = {
    setIsBioActive: setIsBioActive,
    setIsPrivacyActive: setIsPrivacyActive,
    setIsNotificationsActive: setIsNotificationsActive,
    setIsSettingsActive: setIsSettingsActive,
    setIsContactUsActive: setIsContactUsActive,
  }

  return { componentStates, componentSetters }
}

export type ProfileContentSetters = {
  setFirstName: SetStateDispatch<string>
  setLastName: SetStateDispatch<string>
  setBirthDate: SetStateDispatch<Date>
  setGender: SetStateDispatch<string>
  setVideo: SetStateDispatch<Nullable<string>>
  setId: SetStateDispatch<number>
  setInterests: SetStateDispatch<string>
}

// Custom profile hook. This separates saved profile content from edited,
// unsaved profile content.
export function useProfile(
  content: ProfileContentType
): {
  editableContent: ProfileContentType
  contentSetters: ProfileContentSetters
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

  const contentSetters: ProfileContentSetters = {
    setFirstName: setFirstName,
    setLastName: setLastName,
    setBirthDate: setBirthDate,
    setGender: setGender,
    setInterests: setInterests,
    setVideo: setVideo,
    setId: setId,
  }

  return { editableContent, contentSetters }
}

type ProfileContentStrings = Omit<ProfileContentType, "birth_date"> & {
  birth_date: string
}
function toDateString(date: Date): string {
  let day = `${date.getDay()}`
  // Test if day only has one digit.
  if (day.length == 1) {
    day = `0${day}`
  }
  // Month is zero-indexed in Typescript
  let month = `${(date.getMonth() + 1) % 12}`
  // Test if month only has one digit.
  if (month.length == 1) {
    month = `0${month}`
  }
  console.log(`${date.getFullYear()}-${month}-${date.getDay()}`)
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

export type PrivacySetters = {
  setFirstName: SetStateDispatch<PrivacySetting>
  setLastName: SetStateDispatch<PrivacySetting>
  setBirthDate: SetStateDispatch<PrivacySetting>
  setGender: SetStateDispatch<PrivacySetting>
  setInterests: SetStateDispatch<PrivacySetting>
}

// Custom profile privacy settings hook.
export function usePrivacySettings(
  settings: PrivacySettingsType
): {
  editableSettings: PrivacySettingsType
  privacySetters: PrivacySetters
} {
  const [firstName, setFirstName] = useState<PrivacySetting>(
    settings.first_name
  )
  const [lastName, setLastName] = useState<PrivacySetting>(settings.last_name)
  const [birthDate, setBirthDate] = useState<PrivacySetting>(
    settings.birth_date
  )
  const [gender, setGender] = useState<PrivacySetting>(settings.gender)
  const [interests, setInterests] = useState<PrivacySetting>(settings.interests)

  const editableSettings: PrivacySettingsType = {
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    gender: gender,
    interests: interests,
  }

  const privacySetters: PrivacySetters = {
    setFirstName: setFirstName,
    setLastName: setLastName,
    setBirthDate: setBirthDate,
    setGender: setGender,
    setInterests: setInterests,
  }

  return { editableSettings, privacySetters }
}
