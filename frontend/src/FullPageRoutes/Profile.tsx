import * as React from "react"
import { request } from "../utils/fetch"
import {
  useProfileComponents,
  getUpdates,
  useProfile,
  usePrivacySettings,
} from "../utils/profile"
import ProfileSidebar from "../components/profile/ProfileSidebar"
import ProfileContent from "../components/profile/ProfileContent"
import PrivacySettings from "../components/profile/PrivacySettings"
import type { ProfileContentType } from "../components/profile/ProfileContent"
import type { PrivacySettingsType } from "../components/profile/PrivacySettings"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import { Nullable } from "../utils/context"

export type UserProfile = {
  first_name: string
  last_name: string
  phone_number: string
  birth_date: string
  gender: string
  interests: string
  video: Nullable<string>
  id: number
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

export default function Profile(): JSX.Element {
  const classes = useStyles()

  const [
    readonlyContent,
    setProfileContent,
  ] = React.useState<ProfileContentType>({
    first_name: "",
    last_name: "",
    birth_date: new Date(),
    gender: "",
    interests: "",
    video: "",
    id: -1,
  })
  const { editableContent, contentSetters } = useProfile(readonlyContent)

  React.useEffect(() => {
    request<UserProfile>({ path: "/api/profile/", method: "get" })
      .then((res) => {
        const profile: UserProfile = res.parsedBody
        const splitDate = profile.birth_date.split("-")
        const year = parseInt(splitDate[0])
        // Month is 0-indexed in Typescript.
        const monthIndex = parseInt(splitDate[1]) - 1
        const day = parseInt(splitDate[2])
        const content: ProfileContentType = {
          first_name: profile.first_name,
          last_name: profile.last_name,
          birth_date: new Date(year, monthIndex, day),
          gender: profile.gender,
          interests: profile.interests,
          video: profile.video,
          id: profile.id,
        }
        setProfileContent(content)
        contentSetters.setFirstName(content.first_name)
        contentSetters.setLastName(content.last_name)
        contentSetters.setGender(content.gender)
        contentSetters.setBirthDate(content.birth_date)
        contentSetters.setInterests(content.interests)
        contentSetters.setVideo(content.video)
        contentSetters.setId(content.id)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleSaveContent = (
    onSuccess: () => void,
    onFailure: (error: string) => void
  ) => {
    const updates = getUpdates(readonlyContent, editableContent)
    console.log(updates)
    request({
      path: "/api/profile/",
      method: "post",
      body: getUpdates(readonlyContent, editableContent),
    })
      .then(() => {
        setProfileContent(editableContent)
        onSuccess()
      })
      .catch((err) => {
        onFailure(err)
      })
  }

  const [
    readonlySettings,
    setPrivacySettings,
  ] = React.useState<PrivacySettingsType>({
    first_name: "Public",
    last_name: "Public",
    birth_date: "Public",
    gender: "Public",
    interests: "Public",
  })
  const { editableSettings, privacySetters } = usePrivacySettings(
    readonlySettings
  )

  const handleSaveSettings = (
    onSuccess: () => void,
    onFailure: (error: string) => void
  ) => {
    // Profile view is yet to accomodate privacy settings.
    // request({
    //   path: "/api/profileSettings/",
    //   method: "post",
    //   body: editableSettings,
    // })
    //   .then(() => {
    //     setPrivacySettings(editableSettings)
    //     onSuccess()
    //   })
    //   .catch((err) => {
    //     onFailure(err)
    //   })
    onFailure("just cuz")
    setPrivacySettings(editableSettings)
    onSuccess()
  }

  const { componentStates, componentSetters } = useProfileComponents()
  const {
    isBioActive,
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
            componentStateSetters={componentSetters}
          />
        </Grid>
        <Grid item className={classes.section} xs={9}>
          {isBioActive && (
            <ProfileContent
              readonlyContent={readonlyContent}
              editableContent={editableContent}
              contentSetters={contentSetters}
              handleSaveContent={handleSaveContent}
            />
          )}
          {isPrivacyActive && (
            <PrivacySettings
              privacySetters={privacySetters}
              readonlySettings={readonlySettings}
              handleSaveSettings={handleSaveSettings}
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
