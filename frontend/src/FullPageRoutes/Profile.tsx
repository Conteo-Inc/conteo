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
        const profile_content = res.parsedBody

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
          id: profile_content.id,
        }

        setProfileContent(profileContent)
        contentSetters.setFirstName(profileContent.first_name)
        contentSetters.setLastName(profileContent.last_name)
        contentSetters.setGender(profileContent.gender)
        contentSetters.setBirthDate(profileContent.birth_date)
        contentSetters.setInterests(profileContent.interests)
        contentSetters.setImage(profileContent.image)
        contentSetters.setVideo(profileContent.video)
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
