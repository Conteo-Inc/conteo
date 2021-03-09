import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import type { PrivacySetting } from "./PrivacySettings"
import type { ProfileContentSetters } from "../../utils/profile"
import {
  Grid,
  Avatar,
  Typography,
  TextField,
  Button,
  Paper,
  TextFieldProps,
} from "@material-ui/core"
import { Nullable } from "../../utils/context"
import { Colors } from "../../utils/colors"
import { Link } from "react-router-dom"

type ProfileContentProps = {
  readonlyContent: ProfileContentType
  contentSetters: ProfileContentSetters
  handleSaveContent: (
    onSuccess: () => void,
    onFailure: (error: string) => void
  ) => void
}

// This is what the ProfileContent component expects to receive from storage.
export type ProfileContentType = {
  first_name: string
  last_name: string
  birth_date: Date
  gender: string
  interests: string
  video: Nullable<string>
  id: number
}

// A field listed in the content.
type ProfileField = {
  title: string
  value: string
  privacy_level: PrivacySetting
  textFieldProps: TextFieldProps
}

const useStyles = makeStyles({
  profileHeader: {
    padding: "0px 50px",
    marginBottom: 25,
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
    paddingTop: 40,
    paddingBottom: 10,
  },
  field: {
    fontSize: "2rem",
    marginBottom: 15,
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
  button: {
    margin: 5,
  },
})

export default function ProfileContent({
  readonlyContent,
  contentSetters,
  handleSaveContent,
}: ProfileContentProps): JSX.Element {
  const classes = useStyles()
  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errMessage, seterrMessage] = React.useState<string>("")

  // User profile field list. Field values are assigned to readonly content.
  const fields: ProfileField[] = [
    {
      title: "First Name",
      value: readonlyContent.first_name,
      privacy_level: "Public",
      textFieldProps: {
        required: true,
        disabled: false,
        onChange: (e) => {
          contentSetters.setFirstName(e.currentTarget.value)
        },
        inputProps: {
          maxLength: 50,
        },
      },
    },
    {
      title: "Last Name",
      value: readonlyContent.last_name,
      privacy_level: "Public",
      textFieldProps: {
        required: true,
        disabled: false,
        onChange: (e) => {
          contentSetters.setLastName(e.currentTarget.value)
        },
        inputProps: {
          maxLength: 50,
        },
      },
    },
    {
      title: "Birthday",
      value: readonlyContent.birth_date.toLocaleDateString(),
      privacy_level: "Public",
      textFieldProps: {
        required: true,
        disabled: false,
        onChange: (e) => {
          contentSetters.setBirthDate(new Date(e.currentTarget.value))
        },
      },
    },
    {
      title: "Gender",
      value: readonlyContent.gender,
      privacy_level: "Public",
      textFieldProps: {
        required: false,
        disabled: false,
        onChange: (e) => {
          contentSetters.setGender(e.currentTarget.value)
        },
      },
    },
    {
      title: "Interests",
      value: readonlyContent.interests,
      privacy_level: "Public",
      textFieldProps: {
        required: false,
        disabled: false,
        onChange: (e) => {
          contentSetters.setInterests(e.currentTarget.value)
        },
      },
    },
  ]

  const handleEditFields = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    toggleEditMode(true)
  }

  const handleCancelEdit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    seterrMessage("")
    toggleEditMode(false)
  }

  const handleSaveFields = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    handleSaveContent(() => {
      toggleEditMode(false)
    }, seterrMessage)
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item className={classes.profileHeader} xs={12}>
          <Grid container justify="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              <Avatar
                src={"images/profile.jpg"}
                className={classes.profileAvatar}
              />
            </Grid>
            <Grid
              item
              container
              className={classes.introVideo}
              alignItems="center"
              justify="center"
              xs={12}
              sm={6}
            >
              {readonlyContent.video ? (
                <video
                  controls
                  src={readonlyContent.video}
                  width={"100%"}
                  height={"100%"}
                />
              ) : (
                <Button
                  className={classes.recordButton}
                  size="large"
                  component={Link}
                  to={`/record/${readonlyContent.id}`}
                >
                  <Typography variant="h6">Record Intro Video</Typography>
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.fieldsContainer}>
            {isEditMode ? (
              <form onSubmit={handleSaveFields}>
                <Grid container justify="center">
                  <Grid item xs={10}>
                    <Grid container justify="space-between">
                      {fields.map(
                        ({ title, value, textFieldProps }: ProfileField) => (
                          <Grid
                            key={`editableField-${title}`}
                            container
                            className={classes.field}
                            justify="center"
                            sm={10}
                            md={5}
                          >
                            <Grid item className={classes.textField}>
                              <TextField
                                label={title}
                                defaultValue={value}
                                {...textFieldProps}
                                className={classes.textField}
                              />
                            </Grid>
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container justify="center">
                      <Grid item>
                        <Button
                          variant="contained"
                          type="submit"
                          color="primary"
                          className={classes.button}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          className={classes.button}
                          onClick={(e) => {
                            handleCancelEdit(e)
                          }}
                        >
                          Cancel
                        </Button>
                        <br />
                        <span>{errMessage}</span>
                        <br />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Grid container justify="center">
                <Grid item xs={10}>
                  <Grid container justify="space-between">
                    {fields.map(
                      ({ title, value, privacy_level }: ProfileField) => (
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
                          <Grid item xs={4}>
                            <Typography>{value}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography>({privacy_level})</Typography>
                          </Grid>
                        </Grid>
                      )
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={10}>
                  <Grid container justify="center">
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={(e) => {
                          handleEditFields(e)
                        }}
                      >
                        Edit
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
