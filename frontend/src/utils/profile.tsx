import { useState } from "react"
import type {
  ProfileContentType,
  GenderKey,
  Interest,
} from "../components/profile/ProfileContent"
import type {
  PrivacySettingsType,
  PrivacyKey,
} from "../components/profile/PrivacySettings"
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

// TODO: fix the or Interest[].
type ProfileUpdates = {
  [key: string]: string | Interest[]
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
  setFirstNamePrivacy: SetStateDispatch<PrivacyKey>
  setLastNamePrivacy: SetStateDispatch<PrivacyKey>
  setBirthDatePrivacy: SetStateDispatch<PrivacyKey>
  setGenderPrivacy: SetStateDispatch<PrivacyKey>
  setInterestsPrivacy: SetStateDispatch<PrivacyKey>
}

// Custom privacy settings hook. This separates saved privacy settings
// from edited and unsaved privacy settings.
export function usePrivacySettings(
  settings: PrivacySettingsType
): {
  editableSettings: PrivacySettingsType
  privacySetters: PrivacySetters
} {
  const [firstNamePrivacy, setFirstNamePrivacy] = useState<PrivacyKey>(
    settings.first_name_privacy
  )
  const [lastNamePrivacy, setLastNamePrivacy] = useState<PrivacyKey>(
    settings.last_name_privacy
  )
  const [birthDatePrivacy, setBirthDatePrivacy] = useState<PrivacyKey>(
    settings.birth_date_privacy
  )
  const [genderPrivacy, setGenderPrivacy] = useState<PrivacyKey>(
    settings.gender_privacy
  )
  const [interestsPrivacy, setInterestsPrivacy] = useState<PrivacyKey>(
    settings.interests_privacy
  )

  const editableSettings: PrivacySettingsType = {
    first_name_privacy: firstNamePrivacy,
    last_name_privacy: lastNamePrivacy,
    birth_date_privacy: birthDatePrivacy,
    gender_privacy: genderPrivacy,
    interests_privacy: interestsPrivacy,
  }

  const privacySetters: PrivacySetters = {
    setFirstNamePrivacy: setFirstNamePrivacy,
    setLastNamePrivacy: setLastNamePrivacy,
    setBirthDatePrivacy: setBirthDatePrivacy,
    setGenderPrivacy: setGenderPrivacy,
    setInterestsPrivacy: setInterestsPrivacy,
  }

  return { editableSettings, privacySetters }
}

export function getPrivacySettingsUpdates(
  original: ProfileUpdates,
  updated: ProfileUpdates
): ProfileUpdates {
  const result: ProfileUpdates = {}
  Object.keys(original).map((key) => {
    const originalValue = original[key]
    const updatedValue = updated[key]
    if (originalValue != updatedValue) {
      result[key] = updatedValue
    }
  })

  return result
}

export function toDateString(date: Date): string {
  // Month is zero-indexed in Typescript.
  const month = date.getUTCMonth() + 1
  return `${date.getUTCFullYear()}-${month}-${date.getUTCDate()}`
}

export function parseBirthday(birth_date: Nullable<Date>): Nullable<Date> {
  console.log("birth_date:", birth_date)
  let birthday = null
  if (birth_date !== null) {
    birthday = new Date(birth_date)
    // We have Django configured to store dates using local time.
    // Date objects assume the date is UTC when parsing so we add 1
    // to correct for the EST/EDT - UTC timezone difference
    birthday.setDate(birthday.getDate() + 1)
  }
  console.log("birthday:", birthday)

  return birthday
}
