import * as React from "react"
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ProfileSidebar from "../components/profile/ProfileSidebar"
import type { ProfileContentType } from "../components/profile/ProfileContent"
import EditableProfileContent from "../components/profile/EditableProfileContent"
import type { PrivacySettingsType } from "../components/profile/PrivacySettings"
import PrivacySettings from "../components/profile/PrivacySettings"
import { request } from "../utils/fetch"
import {
  useProfileComponents,
  useProfileContent,
  usePrivacySettings,
} from "../utils/profile"

export type UserProfile = {
  profile_content: ProfileContentType
  privacy_settings: PrivacySettingsType
  userId: number
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingBottom: "100px",
    backgroundColor: "rgb(234, 232, 224)",
  },
  sideBar: {
    padding: "10px",
    backgroundColor: "rgb(238, 235, 228)",
  },
  section: {
    padding: "50px",
  },
})

export default function Profile(): JSX.Element {
  const classes = useStyles()
  const [userId, setUserId] = React.useState<number>(-1)

  // Profile content hooks.
  const [
    readonlyContent,
    setProfileContent,
  ] = React.useState<ProfileContentType>({
    first_name: "",
    last_name: "",
    birth_date: null,
    gender: null,
    interests: [],
    image: null,
    video: null,
  })
  const { editableContent, contentSetters } = useProfileContent(readonlyContent)

  // Privacy settings hooks.
  const [
    readonlySettings,
    setPrivacySettings,
  ] = React.useState<PrivacySettingsType>({
    first_name_privacy: "",
    last_name_privacy: "",
    birth_date_privacy: "",
    gender_privacy: "",
    interests_privacy: "",
  })
  const { editableSettings, privacySetters } = usePrivacySettings(
    readonlySettings
  )

  React.useEffect(() => {
    request<UserProfile>({ path: "/api/profile/", method: "get" })
      .then((res) => {
        const { profile_content, privacy_settings, userId } = res.parsedBody
        console.log("profile_content:", profile_content)
        setUserId(userId)

        if (profile_content.birth_date !== null) {
          profile_content.birth_date = new Date(
            (profile_content.birth_date as unknown) as string
          )
        }
        const profileContent: ProfileContentType = {
          first_name: profile_content.first_name,
          last_name: profile_content.last_name,
          birth_date: profile_content.birth_date,
          gender: profile_content.gender,
          interests: profile_content.interests,
          image: profile_content.image,
          video: profile_content.video,
        }

        setProfileContent(profileContent)
        contentSetters.setFirstName(profileContent.first_name)
        contentSetters.setLastName(profileContent.last_name)
        contentSetters.setGender(profileContent.gender)
        contentSetters.setBirthDate(profileContent.birth_date)
        contentSetters.setInterests(profileContent.interests)
        contentSetters.setImage(profileContent.image)
        contentSetters.setVideo(profileContent.video)

        const privacySettings: PrivacySettingsType = {
          first_name_privacy: privacy_settings.first_name_privacy,
          last_name_privacy: privacy_settings.last_name_privacy,
          birth_date_privacy: privacy_settings.birth_date_privacy,
          gender_privacy: privacy_settings.gender_privacy,
          interests_privacy: privacy_settings.interests_privacy,
        }

        setPrivacySettings(privacySettings)
        privacySetters.setFirstNamePrivacy(privacySettings.first_name_privacy)
        privacySetters.setLastNamePrivacy(privacySettings.last_name_privacy)
        privacySetters.setBirthDatePrivacy(privacySettings.birth_date_privacy)
        privacySetters.setGenderPrivacy(privacySettings.gender_privacy)
        privacySetters.setInterestsPrivacy(privacySettings.interests_privacy)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // Component state hooks.
  const { componentStates, componentSetters } = useProfileComponents()
  const { isProfileActive, isPrivacyActive } = componentStates

  return (
    <Grid container className={classes.root}>
      <Grid item className={classes.sideBar} xs={3}>
        <ProfileSidebar
          firstName={readonlyContent.first_name}
          lastName={readonlyContent.last_name}
          image={readonlyContent.image}
          componentStateSetters={componentSetters}
        />
      </Grid>
      <Grid item className={classes.section} xs={9}>
        {isProfileActive && (
          <EditableProfileContent
            readonlyContent={readonlyContent}
            editableContent={editableContent}
            contentSetters={contentSetters}
            setProfileContent={setProfileContent}
            userId={userId}
          />
        )}
        {isPrivacyActive && (
          <PrivacySettings
            readonlySettings={readonlySettings}
            editableSettings={editableSettings}
            privacySetters={privacySetters}
            setPrivacySettings={setPrivacySettings}
            userId={userId}
          />
        )}
      </Grid>
    </Grid>
  )
}
