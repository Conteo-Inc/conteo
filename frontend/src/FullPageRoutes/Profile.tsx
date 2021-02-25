import * as React from "react"
import { request } from "../utils/fetch"
import ProfileSidebar from "../components/ProfileSidebar"
import ProfileContent from "../components/ProfileContent"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import useFocusedUser, { Nullable } from "../utils/context"

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

type UserProfile = {
  first_name: string
  last_name: string
  phone_number?: string
  age?: number
  gender: string
  video: Nullable<string>
  id: number
}

export default function Profile(): JSX.Element {
  const classes = useStyles()
  const [, setFocusedUser] = useFocusedUser()

  const [username, setUsername] = React.useState<string>("")
  const [video, setVideo] = React.useState<Nullable<string>>(null)
  React.useEffect(() => {
    request<UserProfile>({ path: "/api/profile/", method: "get" }).then(
      (profile) => {
        setUsername(profile.parsedBody.first_name)
        setVideo(profile.parsedBody.video)
        setFocusedUser(profile.parsedBody.id)
      }
    )
  })

  // Dummy data.
  const content = {
    username: username,
    name: "Tom Cruise",
    profileImg: "",
    gender: "Male",
    religion: "Scientology",
    location: "Hollywood",
    occupations: ["All the above"],
    age: "58",
    interests: ["Acting", "Film Producing"],
    video: video,
  }

  return (
    <Grid container className={classes.root}>
      <Grid container item className={classes.sideBar} xs={3}>
        <ProfileSidebar name={content.name} profileImg={content.profileImg} />
      </Grid>
      <Grid container item className={classes.section} xs={9}>
        <ProfileContent
          username={content.username}
          name={content.name}
          profileImg={content.profileImg}
          gender={content.gender}
          religion={content.religion}
          location={content.location}
          occupations={content.occupations}
          age={content.age}
          interests={content.interests}
          video={content.video}
        />
        {/* Other components (e.g. Notifications, Settings, and Privacy)
                will be added here with attribute hidden */}
      </Grid>
    </Grid>
  )
}
