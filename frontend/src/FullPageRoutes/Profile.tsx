import * as React from "react"
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import type { ProfileContentType } from "../components/profile/ProfileContent"
import EditableProfileContent from "../components/profile/EditableProfileContent"
import { request } from "../utils/fetch"
import { useProfileContent } from "../utils/profile"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: "5px 20px 100px 20px",
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
    id: -1,
  })
  const { editableContent, contentSetters } = useProfileContent(readonlyContent)

  React.useEffect(() => {
    request<ProfileContentType>({ path: "/api/profile/", method: "get" })
      .then((res) => {
        const profile = res.parsedBody
        setUserId(userId)

        profile.birth_date = new Date((profile.birth_date as unknown) as string)

        setProfileContent(profile)
        contentSetters.setFirstName(profile.first_name)
        contentSetters.setLastName(profile.last_name)
        contentSetters.setGender(profile.gender)
        contentSetters.setBirthDate(profile.birth_date)
        contentSetters.setInterests(profile.interests)
        contentSetters.setImage(profile.image)
        contentSetters.setVideo(profile.video)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <Grid container className={classes.root}>
      <EditableProfileContent
        readonlyContent={readonlyContent}
        editableContent={editableContent}
        contentSetters={contentSetters}
        setProfileContent={setProfileContent}
      />
    </Grid>
  )
}
