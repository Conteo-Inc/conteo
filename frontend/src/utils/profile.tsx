import { useState } from "react"
import { ProfileContentType } from "../components/ProfileContent"

export type ProfileContentSetters = {
  setFirstName: React.Dispatch<React.SetStateAction<string>>
  setLastName: React.Dispatch<React.SetStateAction<string>>
  setUsername: React.Dispatch<React.SetStateAction<string>>
  setAge: React.Dispatch<React.SetStateAction<number>>
  setGender: React.Dispatch<React.SetStateAction<string>>
  setOccupations: React.Dispatch<React.SetStateAction<string[]>>
  setLocation: React.Dispatch<React.SetStateAction<string>>
  setInterests: React.Dispatch<React.SetStateAction<string[]>>
  setReligions: React.Dispatch<React.SetStateAction<string[]>>
  setProfileImg: React.Dispatch<React.SetStateAction<string>>
}

// Custom profile hook. This separates saved profile content from edited, unsaved profile content.
export function useProfile(
  initialProfile: ProfileContentType
): {
  editableContent: ProfileContentType
  setters: ProfileContentSetters
} {
  const [firstName, setFirstName] = useState<typeof initialProfile.firstName>(
    initialProfile.firstName
  )
  const [lastName, setLastName] = useState<typeof initialProfile.lastName>(
    initialProfile.lastName
  )
  const [username, setUsername] = useState<typeof initialProfile.username>(
    initialProfile.username
  )
  const [age, setAge] = useState<typeof initialProfile.age>(initialProfile.age)
  const [gender, setGender] = useState<typeof initialProfile.gender>(
    initialProfile.gender
  )
  const [occupations, setOccupations] = useState<
    typeof initialProfile.occupations
  >(initialProfile.occupations)
  const [location, setLocation] = useState<typeof initialProfile.location>(
    initialProfile.location
  )
  const [interests, setInterests] = useState<typeof initialProfile.interests>(
    initialProfile.interests
  )
  const [religions, setReligions] = useState<typeof initialProfile.religions>(
    initialProfile.religions
  )
  const [profileImg, setProfileImg] = useState<
    typeof initialProfile.profileImg
  >(initialProfile.profileImg)

  const editableContent: ProfileContentType = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    age: age,
    gender: gender,
    occupations: occupations,
    location: location,
    interests: interests,
    religions: religions,
    profileImg: profileImg,
  }

  const setters: ProfileContentSetters = {
    setFirstName,
    setLastName,
    setUsername,
    setAge,
    setGender,
    setOccupations,
    setLocation,
    setInterests,
    setReligions,
    setProfileImg,
  }

  return { editableContent, setters }
}
