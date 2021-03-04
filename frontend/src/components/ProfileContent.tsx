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
  username: string
  firstName: string
  lastName: string
  birthday: Date
  gender: string
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
    height: 200,
    width: 400,
    backgroundColor: "#bdbdbd",
    color: "white",
    textAlign: "center",
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
      value: readonlyContent.firstName,
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
      value: readonlyContent.lastName,
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
      title: "Username",
      value: readonlyContent.username,
      textFieldProps: {
        required: true,
        disabled: true,
        onChange: (e) => {
          setters.setUsername(e.currentTarget.value)
        },
      },
    },
    {
      title: "Birthday",
      value: readonlyContent.birthday.toLocaleDateString(),
      textFieldProps: {
        required: true,
        disabled: true,
        onChange: (e) => {
          setters.setBirthday(new Date(e.currentTarget.value))
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
  ]

  return (
    <Grid container spacing={2}>
      <Grid item className={classes.profileHeader} xs={12}>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Avatar src={""} className={classes.profileAvatar} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.introVideo}>Intro Video</div>
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
