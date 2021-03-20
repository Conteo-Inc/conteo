import * as React from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Typography, TextField, Button, Paper } from "@material-ui/core"
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
import ProfileContent, { GENDER_CHOICES } from "./ProfileContent"
import type { ProfileContentType, GenderKey } from "./ProfileContent"
import type { PrivacySettingsType } from "./PrivacySettings"
import INTEREST_DATA from "./interests.json"
import { Colors } from "../../utils/colors"
import { request } from "../../utils/fetch"
import {
  ProfileContentSetters,
  getProfileContentUpdates,
} from "../../utils/profile"

type EditableProfileContentProps = {
  readonlyContent: ProfileContentType
  privacySettings: PrivacySettingsType
  editableContent: ProfileContentType
  contentSetters: ProfileContentSetters
  setProfileContent: React.Dispatch<React.SetStateAction<ProfileContentType>>
  userId: number
}

type Interest = {
  category: string
  interest: string
}

const useStyles = makeStyles({
  circle: {
    height: 200,
    width: 200,
    display: "flex",
    overflow: "hidden",
    alignItems: "center",
    borderRadius: "50%",
    justifyContent: "center",
  },
  image: {
    // color: "transparent",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  uploadImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "grey",
  },
  introVideo: {
    maxHeight: 200,
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

export default function EditableProfileContent({
  readonlyContent,
  privacySettings,
  editableContent,
  contentSetters: {
    setFirstName,
    setLastName,
    setBirthDate,
    setGender,
    setInterests,
  },
  setProfileContent,
  userId,
}: EditableProfileContentProps): JSX.Element {
  const classes = useStyles()

  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // The input value for an interest that a user is typing in.
  const [interestsInputValue, setInterestsInputValue] = React.useState<string>(
    ""
  )

  const PREDEFINED_INTERESTS: Interest[] = INTEREST_DATA.predefined_interests
  const INTEREST_OPTIONS: string[] = PREDEFINED_INTERESTS.sort(
    (a: Interest, b: Interest) => -b.interest.localeCompare(a.interest)
  )
    .sort((a: Interest, b: Interest) => -b.category.localeCompare(a.category))
    .map(
      (value: { category: string; interest: string }) =>
        `${value.category}: ${value.interest}`
    )

  // Editable user profile element list.
  const editableElements: JSX.Element[] = [
    // FIRST NAME
    <TextField
      key={"editableContent-firstName"}
      variant="outlined"
      label="First Name"
      value={editableContent.first_name}
      required
      onChange={(e) => setFirstName(e.currentTarget.value)}
      inputProps={{
        maxLength: 50,
      }}
      className={classes.textField}
    />,

    // LAST NAME
    <TextField
      key={"editableContent-lastName"}
      variant="outlined"
      label="Last Name"
      value={editableContent.last_name}
      required
      onChange={(e) => setLastName(e.currentTarget.value)}
      inputProps={{
        maxLength: 50,
      }}
      className={classes.textField}
    />,

    // BIRTHDAY
    <MuiPickersUtilsProvider
      key={"editableContent-birthday"}
      utils={DateFnsUtils}
    >
      <KeyboardDatePicker
        autoOk
        variant="inline"
        inputVariant="outlined"
        margin="none"
        label="Birthday"
        format="MM/dd/yyyy"
        value={editableContent.birth_date}
        required
        onChange={setBirthDate}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
        className={classes.textField}
      />
    </MuiPickersUtilsProvider>,

    // GENDER
    <FormControl
      key={"editableContent-gender"}
      variant="outlined"
      className={classes.textField}
    >
      <InputLabel>Gender</InputLabel>
      <Select
        native
        label="Gender"
        value={editableContent.gender ? editableContent.gender : ""}
        onChange={(e) => {
          setGender(e.currentTarget.value as GenderKey)
        }}
      >
        <option aria-label="None" value="" />
        {Object.keys(GENDER_CHOICES).map((key) => (
          <option key={key} value={key}>
            {GENDER_CHOICES[key]}
          </option>
        ))}
      </Select>
    </FormControl>,

    // INTERESTS
    <Autocomplete
      key={"editableContent-interests"}
      multiple
      className={classes.textField}
      options={INTEREST_OPTIONS}
      defaultValue={editableContent.interests.split(",")}
      onChange={(e, value: string[]) => {
        setInterests(value.join(","))
      }}
      inputValue={interestsInputValue}
      onInputChange={(e, newInputValue: string) => {
        setInterestsInputValue(newInputValue)
      }}
      freeSolo
      renderTags={(options: string[], getTagProps) =>
        options.map((option: string, index: number) => (
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
    />,
  ]

  const handleSaveContent = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    const updates = getProfileContentUpdates(readonlyContent, editableContent)
    request({
      path: "/api/profile/",
      method: "put",
      body: updates,
    })
      .then(() => {
        setProfileContent(editableContent)
        toggleEditMode(false)
      })
      .catch((err) => {
        setErrorMessage(err)
      })
  }

  const handleEditContent = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    toggleEditMode(true)
  }

  const handleCancelEdit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setErrorMessage("")
    toggleEditMode(false)
    setFirstName(readonlyContent.first_name)
    setLastName(readonlyContent.last_name)
    setBirthDate(readonlyContent.birth_date)
    setGender(readonlyContent.gender)
    setInterests(readonlyContent.interests)
  }

  return (
    <div>
      {isEditMode ? (
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <Grid
              container
              alignItems="center"
              justify="space-evenly"
              spacing={2}
            >
              <Grid item>
                <div className={classes.circle}>
                  <img
                    className={classes.image}
                    src={"/static/images/profile.jpg"}
                  />
                  <div className={classes.uploadImage}></div>
                </div>
              </Grid>
              <Grid item>
                {editableContent.video ? (
                  <video
                    controls
                    src={editableContent.video}
                    className={classes.introVideo}
                  />
                ) : (
                  <Button
                    className={classes.recordButton}
                    size="large"
                    component={Link}
                    to={`/record/${userId}`}
                  >
                    <Typography variant="h6">Record Intro Video</Typography>
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.fieldsContainer}>
              <Grid container justify="center">
                <Grid item xs={10}>
                  <Grid container justify="space-between">
                    {editableElements.map(
                      (value: JSX.Element, index: number) => (
                        <Grid
                          key={`editableField-${index}`}
                          item
                          container
                          className={classes.field}
                          justify="center"
                          sm={10}
                          md={5}
                        >
                          <Grid item className={classes.textField}>
                            {value}
                          </Grid>
                        </Grid>
                      )
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={(e) => handleSaveContent(e)}
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
                <span>{errorMessage}</span>
                <br />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <ProfileContent
              readonlyContent={readonlyContent}
              privacySettings={privacySettings}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={(e) => handleEditContent(e)}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  )
}
