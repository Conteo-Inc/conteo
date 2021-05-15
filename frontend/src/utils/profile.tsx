import { useState } from "react"
import type {
  ProfileContentType,
  GenderKey,
  Interest,
} from "../components/profile/ProfileContent"
import type {
  PrivacySettingsType,
  PrivacyKey,
} from "../FullPageRoutes/PrivacySettings"
import type { SetStateDispatch, Nullable } from "./context"

export type ProfileComponentStates = {
  isProfileActive: boolean
  isPrivacyActive: boolean
  isNotificationsActive: boolean
  isSettingsActive: boolean
  isContactUsActive: boolean
}

export type ProfileComponentSetters = {
  setIsProfileActive: React.Dispatch<React.SetStateAction<boolean>>
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
    isProfileActive: isBioActive,
    isPrivacyActive: isPrivacyActive,
    isNotificationsActive: isNotificationsActive,
    isSettingsActive: isSettingsActive,
    isContactUsActive: isContactUsActive,
  }

  const componentSetters: ProfileComponentSetters = {
    setIsProfileActive: setIsBioActive,
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
  setBirthDate: SetStateDispatch<Nullable<Date>>
  setGender: SetStateDispatch<Nullable<GenderKey>>
  setInterests: SetStateDispatch<Interest[]>
  setImage: SetStateDispatch<Nullable<string>>
  setVideo: SetStateDispatch<Nullable<string>>
}

// Custom profile content hook. This separates saved profile content
// from edited and unsaved profile content.
export function useProfileContent(
  content: ProfileContentType
): {
  editableContent: ProfileContentType
  contentSetters: ProfileContentSetters
} {
  const [firstName, setFirstName] = useState<string>(content.first_name)
  const [lastName, setLastName] = useState<string>(content.last_name)
  const [birthDate, setBirthDate] = useState<Nullable<Date>>(content.birth_date)
  const [gender, setGender] = useState<Nullable<GenderKey>>(content.gender)
  const [interests, setInterests] = useState<Interest[]>(content.interests)
  const [image, setImage] = useState<Nullable<string>>(content.image)
  const [video, setVideo] = useState<Nullable<string>>(content.video)

  const editableContent: ProfileContentType = {
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    gender: gender,
    interests: interests,
    image: image,
    video: video,
    id: content.id,
  }

  const contentSetters: ProfileContentSetters = {
    setFirstName: setFirstName,
    setLastName: setLastName,
    setBirthDate: setBirthDate,
    setGender: setGender,
    setInterests: setInterests,
    setImage: setImage,
    setVideo: setVideo,
  }

  return { editableContent, contentSetters }
}

// TODO: fix the or Interest[]/number.
type ProfileUpdates = {
  [key: string]: string | Interest[] | number
}

export function getProfileContentUpdates(
  original: ProfileContentType,
  updated: ProfileContentType
): ProfileUpdates {
  const contentToString = (content: ProfileContentType): ProfileUpdates => {
    return {
      ...content,
      gender: content.gender !== null ? content.gender : "",
      birth_date:
        content.birth_date !== null ? toDateString(content.birth_date) : "",
      image: content.image !== null ? content.image : "",
      video: content.video !== null ? content.video : "",
    }
  }

  const canon: ProfileUpdates = contentToString(original)
  const other: ProfileUpdates = contentToString(updated)

  const result: ProfileUpdates = {}
  Object.keys(canon).map((key) => {
    const originalValue = canon[key]
    const updatedValue = other[key]
    if (originalValue != updatedValue) {
      result[key] = updatedValue
    }
  })

  return result
}

export type PrivacySetters = {
  setFirstName: SetStateDispatch<PrivacyKey>
  setLastName: SetStateDispatch<PrivacyKey>
  setBirthDate: SetStateDispatch<PrivacyKey>
  setGender: SetStateDispatch<PrivacyKey>
  setInterests: SetStateDispatch<PrivacyKey>
}

// Custom privacy settings hook. This separates saved privacy settings
// from edited and unsaved privacy settings.
export function usePrivacySettings({
  first_name,
  last_name,
  birth_date,
  gender,
  interests,
  profile,
}: PrivacySettingsType): {
  editableSettings: PrivacySettingsType
  privacySetters: PrivacySetters
} {
  const [firstName, setFirstName] = useState<PrivacyKey>(first_name)
  const [lastName, setLastName] = useState<PrivacyKey>(last_name)
  const [birthDate, setBirthDate] = useState<PrivacyKey>(birth_date)
  const [_gender, setGender] = useState<PrivacyKey>(gender)
  const [_interests, setInterests] = useState<PrivacyKey>(interests)

  const editableSettings: PrivacySettingsType = {
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDate,
    gender: _gender,
    interests: _interests,
    profile: profile,
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

export function toDateString(date: Date): string {
  // Month is zero-indexed in Typescript.
  const month = date.getUTCMonth() + 1
  return `${date.getUTCFullYear()}-${month}-${date.getUTCDate()}`
}
