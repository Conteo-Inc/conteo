import * as React from "react"
import { Grid, Avatar, Typography, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import Video from "../video/Video"
import { Colors } from "../../utils/colors"
import { Nullable } from "../../utils/context"
import { toDateString } from "../../utils/profile"

type ProfileContentProps = {
  readonlyContent: ProfileContentType
}

export type ProfileContentType = {
  first_name: string
  last_name: string
  birth_date: Nullable<Date>
  gender: Nullable<GenderKey>
  interests: Interest[]
  image: Nullable<string>
  video: Nullable<string>
}

export type GenderKey = "" | "M" | "F" | "O"

type GenderValue = "Male" | "Female" | "Other"

type GenderChoice = {
  [key: string]: GenderValue
}

export const GENDER_CHOICES: GenderChoice = {
  M: "Male",
  F: "Female",
  O: "Other",
}

export type Interest = {
  category: string
  title: string
  id: number
}

// A field listed in the content.
type ProfileField = {
  title: string
  value: string
}

const useStyles = makeStyles({
  profileAvatar: {
    height: "200px",
    width: "200px",
  },
  introVideo: {
    maxHeight: "200px",
  },
  fieldsContainer: {
    paddingTop: "40px",
    paddingBottom: "10px",
  },
  field: {
    minHeight: "50px",
    marginBottom: "15px",
    fontSize: "2rem",
  },
  recordButton: {
    backgroundColor: Colors.DEEP_BLUE,
    color: "white",
    "&:hover": {
      backgroundColor: Colors.DEEP_RED,
    },
  },
  textField: {
    width: "100%",
  },
})

function buildProfileFieldList({
  first_name,
  last_name,
  birth_date,
  gender,
  interests,
}: ProfileContentType): ProfileField[] {
  return [
    {
      title: "First Name",
      value: first_name,
    },
    {
      title: "Last Name",
      value: last_name,
    },
    {
      title: "Birthday",
      value: birth_date !== null ? toDateString(birth_date) : "",
    },
    {
      title: "Gender",
      value: gender !== null ? GENDER_CHOICES[gender] : "",
    },
    {
      title: "Interests",
      value: interests
        .map((interest: Interest) => `${interest.category}: ${interest.title}`)
        .join(", "),
    },
  ]
}

export default function ProfileContent({
  readonlyContent,
}: ProfileContentProps): JSX.Element {
  const classes = useStyles()

  // User profile field list. Field values are assigned to readonly content.
  const profileFieldList: ProfileField[] = buildProfileFieldList(
    readonlyContent
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justify="space-evenly" spacing={2}>
          <Grid item>
            <Avatar
              src={readonlyContent.image ? readonlyContent.image : ""}
              className={classes.profileAvatar}
            />
          </Grid>
          {readonlyContent.video && (
            <Grid item>
              <Video
                src={readonlyContent.video}
                className={classes.introVideo}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.fieldsContainer}>
          <Grid container justify="center">
            <Grid item xs={10}>
              <Grid container justify="space-between">
                {profileFieldList.map(({ title, value }: ProfileField) => (
                  <Grid
                    key={`readonlyField-${title}`}
                    item
                    container
                    className={classes.field}
                    justify="space-between"
                    sm={10}
                    md={5}
                  >
                    <Grid item xs={3}>
                      <Typography>{title}:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography>{value}</Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
