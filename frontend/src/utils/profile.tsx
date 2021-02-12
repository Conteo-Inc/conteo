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
  setReligion: React.Dispatch<React.SetStateAction<string>>
  setProfileImg: React.Dispatch<React.SetStateAction<string>>
}

// Custom profile hook. This separates saved profile content from edited, unsaved profile content.
export function useProfile(initialProfile: ProfileContentType) {
  const [firstName, setFirstName] = useState<typeof initialProfile.firstName>(initialProfile.firstName)
  const [lastName, setLastName] = useState<typeof initialProfile.lastName>(initialProfile.lastName)
  const [username, setUsername] = useState<typeof initialProfile.username>(initialProfile.username)
  const [age, setAge] = useState<typeof initialProfile.age>(initialProfile.age)
  const [gender, setGender] = useState<typeof initialProfile.gender>(initialProfile.gender)
  const [occupations, setOccupations] = useState<typeof initialProfile.occupations>(initialProfile.occupations)
  const [location, setLocation] = useState<typeof initialProfile.location>(initialProfile.location)
  const [interests, setInterests] = useState<typeof initialProfile.interests>(initialProfile.interests)
  const [religion, setReligion] = useState<typeof initialProfile.religion>(initialProfile.religion)
  const [profileImg, setProfileImg] = useState<typeof initialProfile.profileImg>(initialProfile.profileImg)

  const editableContent: ProfileContentType = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    age: age,
    gender: gender,
    occupations: occupations,
    location: location,
    interests: interests,
    religion: religion,
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
    setReligion,
    setProfileImg,
  }

  return { editableContent, setters }
}
