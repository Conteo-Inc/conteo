import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import type { ProfileContentSetters } from "../utils/profile"
import {
  Grid,
  Avatar,
  Typography,
  TextField,
  Button,
  Paper,
  TextFieldProps,
} from "@material-ui/core"
import { Nullable } from "../utils/context"
import { Colors } from "../utils/colors"
import { Link } from "react-router-dom"

type ProfileContentProps = {
  readonlyContent: ProfileContentType
  setters: ProfileContentSetters
  isEditMode: boolean
  errMessage: string
  handleEditFields: () => void
  handleCancelEdit: () => void
  handleSaveFields: (event: React.FormEvent<HTMLFormElement>) => void
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
  bottomRight: {
    position: "absolute",
    bottom: "0",
    right: "0",
    transform: "translate(-10%, -10%)",
  },
  bottomRight2: {
    position: "absolute",
    bottom: "0",
    right: "0",
    transform: "translate(-100%, -10%)",
  },
  recordButton: {
    backgroundColor: Colors.DEEP_BLUE,
    color: "white",
    "&:hover": {
      backgroundColor: Colors.DEEP_RED,
    },
  },
})

export default function ProfileContent({
  readonlyContent,
  setters,
  isEditMode,
  errMessage,
  handleEditFields,
  handleCancelEdit,
  handleSaveFields,
}: ProfileContentProps): JSX.Element {
  const classes = useStyles()

  // User profile field list. Field values are assigned to readonly content.
  const fields: ProfileField[] = [
    {
      title: "First Name",
      value: readonlyContent.first_name,
      textFieldProps: {
        required: true,
        disabled: false,
        onChange: (e) => {
          setters.setFirstName(e.currentTarget.value)
        },
        inputProps: {
          maxLength: 50,
        },
      },
    },
    {
      title: "Last Name",
      value: readonlyContent.last_name,
      textFieldProps: {
        required: true,
        disabled: false,
        onChange: (e) => {
          setters.setLastName(e.currentTarget.value)
        },
        inputProps: {
          maxLength: 50,
        },
      },
    },
    {
      title: "Birthday",
      value: readonlyContent.birth_date.toLocaleDateString(),
      textFieldProps: {
        required: true,
        disabled: true,
        onChange: (e) => {
          setters.setBirthDate(new Date(e.currentTarget.value))
        },
      },
    },
    {
      title: "Gender",
      value: readonlyContent.gender,
      textFieldProps: {
        required: false,
        disabled: false,
        onChange: (e) => {
          setters.setGender(e.currentTarget.value)
        },
      },
    },
    {
      title: "Interests",
      value: readonlyContent.interests,
      textFieldProps: {
        required: false,
        disabled: false,
        onChange: (e) => {
          setters.setInterests(e.currentTarget.value)
        },
      },
    },
  ]

  return (
    <Grid container spacing={2}>
      <Grid item className={classes.profileHeader} xs={12}>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Avatar src={""} className={classes.profileAvatar} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            container
            alignItems="center"
            justify="center"
            className={classes.introVideo}
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
      {!isEditMode && (
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={2}>
              {fields.map(({ title, value }: ProfileField) => (
                <Grid
                  key={`readonlyField-${title}`}
                  container
                  item
                  justify="flex-end"
                  className={classes.field}
                  sm={12}
                  md={6}
                >
                  <Grid item xs={9}>
                    <Typography>
                      {title}: {value}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
              <Grid container item justify="center" xs={12}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ margin: 5 }}
                    onClick={handleEditFields}
                  >
                    Edit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      {isEditMode && (
        <Grid item xs={12}>
          <Paper>
            <form onSubmit={handleSaveFields}>
              <Grid container spacing={2}>
                {fields.map(
                  ({ title, value, textFieldProps }: ProfileField) => (
                    <Grid
                      key={`editableField-${title}`}
                      container
                      item
                      justify="flex-end"
                      className={classes.field}
                      sm={12}
                      md={6}
                    >
                      <Grid item xs={9}>
                        <TextField
                          label={title}
                          defaultValue={value}
                          {...textFieldProps}
                        />
                      </Grid>
                    </Grid>
                  )
                )}
                <Grid container item justify="center" xs={12}>
                  <Grid item>
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      style={{ margin: 5 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      style={{ margin: 5 }}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <br />
              <span>{errMessage}</span>
              <br />
            </form>
          </Paper>
        </Grid>
      )}
    </Grid>
  )
}
