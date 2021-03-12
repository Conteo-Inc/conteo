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
} from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"
import Chip from "@material-ui/core/Chip"
import Autocomplete from "@material-ui/lab/Autocomplete"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import { Nullable } from "../../utils/context"
import { Colors } from "../../utils/colors"
import { Link } from "react-router-dom"

type ProfileContentProps = {
  readonlyContent: ProfileContentType
  editableContent: ProfileContentType
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
  editableElement: JSX.Element
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

type GenderChoice = {
  [key: string]: string
}

const GENDER_CHOICES: GenderChoice = {
  M: "Male",
  F: "Female",
  O: "Other",
}

const INTEREST_CHOICES: string[] = [
  "Testing user profiles",
  "Breakfast",
  "Conteo",
]

export default function ProfileContent({
  readonlyContent,
  editableContent,
  contentSetters,
  handleSaveContent,
}: ProfileContentProps): JSX.Element {
  const classes = useStyles()
  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errMessage, seterrMessage] = React.useState<string>("")
  // The input value for an interest that a user is typing in.
  const [interestsInputValue, setInterestsInputValue] = React.useState<string>(
    ""
  )

  // User profile field list. Field values are assigned to readonly content.
  const fields: ProfileField[] = [
    {
      title: "First Name",
      value: readonlyContent.first_name,
      privacy_level: "Public",
      editableElement: (
        <TextField
          variant="outlined"
          label={"First Name"}
          value={editableContent.first_name}
          required
          onChange={(e) => contentSetters.setFirstName(e.currentTarget.value)}
          inputProps={{
            maxLength: 50,
          }}
          className={classes.textField}
        />
      ),
    },
    {
      title: "Last Name",
      value: readonlyContent.last_name,
      privacy_level: "Public",
      editableElement: (
        <TextField
          variant="outlined"
          label={"Last Name"}
          value={editableContent.last_name}
          required
          onChange={(e) => contentSetters.setLastName(e.currentTarget.value)}
          inputProps={{
            maxLength: 50,
          }}
          className={classes.textField}
        />
      ),
    },
    {
      title: "Birthday",
      value:
        readonlyContent.birth_date &&
        readonlyContent.birth_date.toLocaleDateString(),
      privacy_level: "Public",
      editableElement: (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            margin="none"
            label="Birthday"
            format="MM/dd/yyyy"
            value={editableContent.birth_date}
            required
            onChange={(date: Date | null) =>
              // Attribute required is set, so date should never be null.
              contentSetters.setBirthDate(date != null ? date : new Date())
            }
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            className={classes.textField}
          />
        </MuiPickersUtilsProvider>
      ),
    },
    {
      title: "Gender",
      value: GENDER_CHOICES[readonlyContent.gender],
      privacy_level: "Public",
      editableElement: (
        <FormControl variant="outlined" className={classes.textField}>
          <InputLabel>Gender</InputLabel>
          <Select
            native
            value={editableContent.gender}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              contentSetters.setGender(e.target.value as string)
            }
            label="Gender"
          >
            {Object.keys(GENDER_CHOICES).map((key) => (
              <option key={key} value={key}>
                {GENDER_CHOICES[key]}
              </option>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      title: "Interests",
      value: readonlyContent.interests,
      privacy_level: "Public",
      editableElement: (
        <Autocomplete
          multiple
          className={classes.textField}
          options={INTEREST_CHOICES}
          defaultValue={editableContent.interests.split(", ")}
          onChange={(e, value: string[]) =>
            contentSetters.setInterests(value.join(", "))
          }
          inputValue={interestsInputValue}
          onInputChange={(e, newInputValue: string) =>
            setInterestsInputValue(newInputValue)
          }
          freeSolo
          renderTags={(value: string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                key={`${option}-${index}`}
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Interests" variant="outlined" />
          )}
        />
      ),
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
                        ({ title, editableElement }: ProfileField) => (
                          <Grid
                            key={`editableField-${title}`}
                            item
                            container
                            className={classes.field}
                            justify="center"
                            sm={10}
                            md={5}
                          >
                            <Grid item className={classes.textField}>
                              {editableElement}
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
                          onClick={(e) => handleCancelEdit(e)}
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
                        onClick={(e) => handleEditFields(e)}
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
