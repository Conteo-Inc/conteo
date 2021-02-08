import { useState } from 'react'
import { ProfileContentProps } from '../components/ProfileContent'

// Custom profile hook. This separates saved profile content from edited, unsaved profile content.
export function useProfile(initialProfile: ProfileContentProps) {
    const [name, setName] = useState<typeof initialProfile.name>(initialProfile.name)
    const [username, setUsername] = useState<typeof initialProfile.username>(initialProfile.username)
    const [age, setAge] = useState<typeof initialProfile.age>(initialProfile.age)
    const [gender, setGender] = useState<typeof initialProfile.gender>(initialProfile.gender)
    const [occupations, setOccupations] = useState<typeof initialProfile.occupations>(initialProfile.occupations)
    const [location, setLocation] = useState<typeof initialProfile.location>(initialProfile.location)
    const [interests, setInterests] = useState<typeof initialProfile.interests>(initialProfile.interests)
    const [religion, setReligion] = useState<typeof initialProfile.religion>(initialProfile.religion)
    const [profileImg, setProfileImg] = useState<typeof initialProfile.profileImg>(initialProfile.profileImg)

    const editableContent: ProfileContentProps = {
        name: name,
        username: username,
        age: age,
        gender: gender,
        occupations: occupations,
        location: location,
        interests: interests,
        religion: religion,
        profileImg: profileImg,
    }

    const setters = {
        setName,
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
