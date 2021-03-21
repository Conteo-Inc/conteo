import * as React from "react"
import { Grid, Avatar, Typography, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Colors } from "../../utils/colors"
import { Nullable } from "../../utils/context"

type ProfileContentProps = {
  readonlyContent: ProfileContentType
}

export type ProfileContentType = {
  first_name: string
  last_name: string
  birth_date: Nullable<Date>
  gender: Nullable<GenderKey>
  interests: Interest[]
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
}

// A field listed in the content.
type ProfileField = {
  title: string
  value: string
}

const useStyles = makeStyles({
  profileAvatar: {
    height: 200,
    width: 200,
  },
  introVideo: {
    maxHeight: 200,
  },
  fieldsContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  field: {
    minHeight: 50,
    marginBottom: 15,
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

export default function ProfileContent({
  readonlyContent: {
    first_name,
    last_name,
    birth_date,
    gender,
    interests,
    video,
  },
}: ProfileContentProps): JSX.Element {
  const classes = useStyles()

  // User profile field list. Field values are assigned to readonly content.
  const fields: ProfileField[] = [
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
      value: birth_date !== null ? birth_date.toLocaleDateString() : "",
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

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid
            container
            alignItems="center"
            justify="space-evenly"
            spacing={2}
          >
            <Grid item>
              <Avatar
                src={""}
                className={classes.profileAvatar}
              />
            </Grid>
            {video && (
              <Grid item>
                <video controls src={video} className={classes.introVideo} />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.fieldsContainer}>
            <Grid container justify="center">
              <Grid item xs={10}>
                <Grid container justify="space-between">
                  {fields.map(({ title, value }: ProfileField) => (
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
    </div>
  )
}
