import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Avatar, Typography, Button } from "@material-ui/core"
import { Nullable } from "../utils/context"
import { Link } from "react-router-dom"
import { Colors } from "../utils/colors"

// This is what the ProfileContent component expects to receive from storage.
type ProfileContentProps = {
  username: string
  name: string
  profileImg: string
  gender: string
  religion: string
  location: string
  occupations: string[]
  age: number | string
  interests: string[]
  video: Nullable<string>
}

// A field listed in the content.
type ProfileField = {
  title: string
  value: string
}

const useStyles = makeStyles({
  profileHeader: {
    padding: "0 50",
  },
  profileAvatar: {
    height: 200,
    width: 200,
  },
  introVideo: {
    color: "white",
    textAlign: "center",
    marginBottom: "1rem",
  },
  fieldsContainer: {
    position: "relative",
    boxShadow:
      "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
    borderRadius: 4,
    color: "rgba(0, 0, 0, 0.87)",
    transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    backgroundColor: "#fff",
    padding: "0 100px",
  },
  field: {
    fontSize: "2rem",
    padding: 5,
    paddingRight: 10,
  },
  recordButton: {
    backgroundColor: Colors.DEEP_BLUE,
    color: "white",
    "&:hover": {
      backgroundColor: Colors.DEEP_RED,
    },
  },
})

export default function ProfileContent(
  props: ProfileContentProps
): JSX.Element {
  const classes = useStyles()

  // Add user profile values to list.
  const profileFields: ProfileField[] = [
    {
      title: "Full Name",
      value: props.name,
    },
    {
      title: "Username",
      value: props.username,
    },
    {
      title: "Age",
      value: props.age.toString(),
    },
    {
      title: "Gender",
      value: props.gender,
    },
    {
      title: "Occupations",
      value: props.occupations.join(", "),
    },
    {
      title: "Location",
      value: props.location,
    },
    {
      title: "Interests",
      value: props.interests.join(", "),
    },
    {
      title: "Religion",
      value: props.religion,
    },
  ]

  return (
    <>
      <Grid
        container
        item
        className={classes.profileHeader}
        xs={12}
        direction="row"
        justify="space-between"
      >
        <Grid container item alignItems="center" justify="center" xs={6}>
          <Avatar
            alt={props.name}
            src={props.profileImg}
            className={classes.profileAvatar}
          />
        </Grid>
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          xs={4}
          className={classes.introVideo}
        >
          {props.video ? (
            <video controls src={props.video} width={"100%"} height={"100%"} />
          ) : (
            <Button
              className={classes.recordButton}
              size="large"
              component={Link}
              to="/record"
            >
              <Typography variant="h6">Record Intro Video</Typography>
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        className={classes.fieldsContainer}
        xs={12}
      >
        {profileFields.map(({ title, value }: ProfileField) => (
          <Grid key={title} item className={classes.field} sm={12} md={6}>
            <Typography>
              {title}: {value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
