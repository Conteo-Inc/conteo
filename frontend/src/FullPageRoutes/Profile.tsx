import * as React from "react"
import { request } from "../utils/fetch"
import { useProfile } from "../utils/profile"
import ProfileSidebar from "../components/ProfileSidebar"
import ProfileContent from "../components/ProfileContent"
import type { ProfileContentType } from "../components/ProfileContent"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"

export type UserProfile = {
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  birth_date: string
  gender: string
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
  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errMessage, seterrMessage] = React.useState<string>("")
  const classes = useStyles()

  const [readonlyContent, setProfile] = React.useState<ProfileContentType>({
    username: "",
    firstName: "",
    lastName: "",
    birthday: new Date(),
    gender: "",
  })
  const { editableContent, setters } = useProfile(readonlyContent)

  React.useEffect(() => {
    request<UserProfile>({ path: "/api/profile/", method: "get" })
      .then((res) => {
        const profile: UserProfile = res.parsedBody
        const content: ProfileContentType = {
          username: profile.username,
          firstName: profile.first_name,
          lastName: profile.last_name,
          birthday: new Date(profile.birth_date),
          gender: profile.gender,
        }
        setProfile(content)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleEditFields = () => {
    toggleEditMode(true)
  }

  const handleCancelEdit = () => {
    seterrMessage("")
    toggleEditMode(false)
  }

  const handleSaveFields = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    request({ path: "/api/profile/", method: "put", body: editableContent })
      .then(() => {
        setProfile(editableContent)
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
          firstName={readonlyContent.firstName}
          lastName={readonlyContent.lastName}
        />
      </Grid>
      <Grid container item className={classes.section} xs={9}>
        <ProfileContent
          isEditMode={isEditMode}
          setters={setters}
          readonlyContent={readonlyContent}
          handleEditFields={handleEditFields}
          handleCancelEdit={handleCancelEdit}
          handleSaveFields={handleSaveFields}
          errMessage={errMessage}
        />
        {/* Other components (e.g. Notifications, Settings, and Privacy) will be
        added here to be rendered when the respective component is selected from
        sidebar. */}
      </Grid>
    </Grid>
  )
}
