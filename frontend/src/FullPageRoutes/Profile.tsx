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
import { Nullable } from "../utils/context"

export type UserProfile = {
  profile_content: ProfileContentType
  privacy_settings: PrivacySettingsType
  userId: number
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  sideBar: {
    padding: 10,
    backgroundColor: "rgb(238, 235, 228)",
  },
  section: {
    padding: 50,
    backgroundColor: "rgb(234, 232, 224)",
  },
})

function parseBirthday(birth_date: Nullable<Date>): Nullable<Date> {
  let birthday = null
  if (birth_date !== null) {
    birthday = new Date(birth_date)
    // Typescript removes a day.
    birthday.setDate(birthday.getDate() + 1)
  }

  return birthday
}

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
    image_file: null,
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
        const { profile_content, privacy_settings } = res.parsedBody
        setUserId(res.parsedBody.userId)

        const birthday = parseBirthday(profile_content.birth_date)
        const profileContent: ProfileContentType = {
          first_name: profile_content.first_name,
          last_name: profile_content.last_name,
          birth_date: birthday,
          gender: profile_content.gender,
          interests: profile_content.interests,
          image_file: profile_content.image_file,
          video: profile_content.video,
        }

        setProfileContent(profileContent)
        contentSetters.setFirstName(profileContent.first_name)
        contentSetters.setLastName(profileContent.last_name)
        contentSetters.setGender(profileContent.gender)
        contentSetters.setBirthDate(profileContent.birth_date)
        contentSetters.setInterests(profileContent.interests)
        contentSetters.setImage(profileContent.image_file)
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
  const {
    isProfileActive,
    isPrivacyActive,
    // isNotificationsActive,
    // isSettingsActive,
    // isContactUsActive,
  } = componentStates

  return (
    <div>
      <Grid container className={classes.root}>
        <Grid item className={classes.sideBar} xs={3}>
          <ProfileSidebar
            firstName={readonlyContent.first_name}
            lastName={readonlyContent.last_name}
            image={readonlyContent.image_file}
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
          {/*
            {isNotificationsActive && (
              // Add notifications component here
            )}
            {isSettingsActive && (
              // Add settings component here
            )}
            {isContactUsActive && (
              // Add contact us component here
            )}
          */}
        </Grid>
      </Grid>
    </div>
  )
}
