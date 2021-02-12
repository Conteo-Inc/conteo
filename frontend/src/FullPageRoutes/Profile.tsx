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
  data: {
    first_name: string
    last_name: string
    phone_number: string
    age: string | number
    gender: string
  }
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

  const dummyUserProfile: UserProfile = {
    username: "nope",
    data: {
      first_name: "nope",
      last_name: "nope",
      phone_number: "nope",
      age: -1,
      gender: "nope",
    },
  }

  const [userData, setUserData] = React.useState<UserProfile>(dummyUserProfile)
  React.useEffect(() => {
    request<UserProfile>("/api/current_user/", "get", true, false)
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
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })

  // Dummy data.
  const content: ProfileContentType = {
    username: userData.username,
    firstName: userData.data.first_name,
    lastName: userData.data.last_name,
    profileImg: "",
    gender: userData.data.gender,
    religions: ["Scientology"],
    location: "Hollywood",
    occupations: ["All the above"],
    age: Number(userData.data.age),
    interests: ["Acting", "Film Producing"],
  }

  // Pass props to to useProfile hook.
  const { editableContent, setters } = useProfile(content)

  // Initialize readonly profile content and acquire hook to update it when edits are saved.
  const [readonlyContent, setProfile] = React.useState<ProfileContentType>(
    editableContent
  )
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
          setProfile={setProfile}
        />
        {/* Other components (e.g. Notifications, Settings, and Privacy) will be
        added here to be rendered when the respective component is selected from
        sidebar. */}
      </Grid>
    </Grid>
  )
}
