import * as React from "react"
import { request } from "../utils/fetch"
import { useProfile } from "../utils/profile"
import ProfileSidebar from "../components/ProfileSidebar"
import ProfileContent from "../components/ProfileContent"
import type { ProfileContentType } from "../components/ProfileContent"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"

type UserProfile = {
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  birth_date: Date | string
  gender: string
}

type SaveProfileResponse = {
  token: string
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

  // Dummy user profile data used to test which data is successfully retrieved
  // from DB.
  const dummyUserProfile: UserProfile = {
    username: "nope",
    email: "nope",
    first_name: "nope",
    last_name: "nope",
    phone_number: "nope",
    birth_date: new Date(Date.now()),
    gender: "nope",
  }

  // Initialize user data with dummy data.
  const [userData, setUserData] = React.useState<UserProfile>(dummyUserProfile)
  React.useEffect(() => {
    request<UserProfile>("/api/profile/", "get", true)
      .then((resp) => {
        if (resp.parsedBody) {
          console.log(`resp.parsedBody: `)
          console.log(resp.parsedBody)
          setUserData(resp.parsedBody)
        } else {
          console.error(
            "FIXME: resp.parsedBody was undefined and so lodaing the user \
                  profile failed. This is a problem with the code that needs \
                  to be addressed"
          )
          console.log("resp: ")
          console.log(resp)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })

  // Dummy profile content data.
  const content: ProfileContentType = {
    username: userData.username,
    firstName: userData.first_name,
    lastName: userData.last_name,
    birthday: new Date(userData.birth_date),
    gender: userData.gender,
    occupations: ["All the above"],
    location: "Hollywood",
    religions: ["Scientology"],
    interests: ["Acting", "Film Producing"],
    profileImg: "",
  }

  // Pass props to useProfile hook.
  const { editableContent, setters } = useProfile(content)

  // Initialize readonly profile content and acquire hook to update it when edits are saved.
  const [readonlyContent, setProfile] = React.useState<ProfileContentType>(
    editableContent
  )

  const saveProfileFields = (unsavedContent: ProfileContentType) => {
    request<SaveProfileResponse>("/api/profile/", "post", true, unsavedContent)
      .then(() => {
        setProfile(unsavedContent)
        toggleEditMode(false)
      })
      .catch((err) => {
        seterrMessage(err)
      })
  }

  return (
    <Grid container className={classes.root}>
      <Grid container item className={classes.sideBar} xs={3}>
        <ProfileSidebar
          name={`${readonlyContent.firstName} ${readonlyContent.lastName}`}
          profileImg={readonlyContent.profileImg}
        />
      </Grid>
      <Grid container item className={classes.section} xs={9}>
        <ProfileContent
          editableContent={editableContent}
          setters={setters}
          readonlyContent={readonlyContent}
          saveProfileFields={saveProfileFields}
        />
        {/* Other components (e.g. Notifications, Settings, and Privacy) will be
        added here to be rendered when the respective component is selected from
        sidebar. */}
      </Grid>
    </Grid>
  )
}
