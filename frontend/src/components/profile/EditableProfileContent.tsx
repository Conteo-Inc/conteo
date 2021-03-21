import * as React from "react"
import { Link } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
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
import ProfileContent, { GENDER_CHOICES } from "./ProfileContent"
import type { ProfileContentType, GenderKey } from "./ProfileContent"
import INTEREST_DATA from "./interests.json"
import { Colors } from "../../utils/colors"
import { request } from "../../utils/fetch"
import {
  ProfileContentSetters,
  getProfileContentUpdates,
} from "../../utils/profile"

type EditableProfileContentProps = {
  readonlyContent: ProfileContentType
  editableContent: ProfileContentType
  contentSetters: ProfileContentSetters
  setProfileContent: React.Dispatch<React.SetStateAction<ProfileContentType>>
  userId: number
}

type Interest = {
  category: string
  title: string
}

const MAX_FIRST_NAME_LENGTH = 50
const MAX_LAST_NAME_LENGTH = 50
const MAX_INTEREST_LENGTH = 30

const useStyles = makeStyles({
  profileAvatar: {
    height: 200,
    width: 200,
  },
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
    width: "inherit",
    height: "inherit",
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
  error: {
    color: "red",
  },
})

export default function EditableProfileContent({
  readonlyContent,
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
  const [interestInputValue, setInterestInputValue] = React.useState<string>("")

  const INTEREST_OPTIONS: Interest[] = INTEREST_DATA.predefined_interests
    .sort((a: Interest, b: Interest) => -b.title.localeCompare(a.title))
    .sort((a: Interest, b: Interest) => -b.category.localeCompare(a.category))

  const isTheSameInterest = (a: Interest, b: Interest): boolean => {
    return a.category === b.category && a.title === b.title
  }

  // Editable user profile element list.
  const editableElements: JSX.Element[] = [
    // FIRST NAME
    <TextField
      key={"editableContent-firstName"}
      required
      className={classes.textField}
      variant="outlined"
      label="First Name"
      value={editableContent.first_name}
      onChange={(e) => setFirstName(e.currentTarget.value)}
      inputProps={{ maxLength: MAX_FIRST_NAME_LENGTH }}
    />,

    // LAST NAME
    <TextField
      key={"editableContent-lastName"}
      required
      className={classes.textField}
      variant="outlined"
      label="Last Name"
      value={editableContent.last_name}
      onChange={(e) => setLastName(e.currentTarget.value)}
      inputProps={{ maxLength: MAX_LAST_NAME_LENGTH }}
    />,

    // BIRTHDAY
    <MuiPickersUtilsProvider
      key={"editableContent-birthday"}
      utils={DateFnsUtils}
    >
      <KeyboardDatePicker
        autoOk
        required
        className={classes.textField}
        variant="inline"
        inputVariant="outlined"
        margin="none"
        label="Birthday"
        format="MM/dd/yyyy"
        value={editableContent.birth_date}
        onChange={setBirthDate}
        KeyboardButtonProps={{ "aria-label": "change date" }}
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
        onChange={(e) => setGender(e.currentTarget.value as GenderKey)}
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
      clearOnBlur
      freeSolo
      className={classes.textField}
      options={INTEREST_OPTIONS}
      groupBy={(interest) => interest.category}
      getOptionLabel={(interest) =>
        typeof interest === "string" ? interest : interest.title
      }
      getOptionSelected={isTheSameInterest}
      value={editableContent.interests}
      onChange={(e, interests: (string | Interest)[]) => {
        // Get all the new interests.
        const allNewInterests: Interest[] = interests.map(
          (val: string | Interest) =>
            typeof val === "string" ? { category: "Other", title: val } : val
        )

        // Test if interest a exists in allInterests.
        const isDuplicate = (
          a: Interest,
          allInterests: Interest[]
        ): boolean => {
          let isDuplicate = false
          allInterests.every((b: Interest) => {
            isDuplicate = isTheSameInterest(a, b)
            // If interest a is a duplicate,
            // then return false to break loop,
            // otherwise return true to continue.
            return !isDuplicate
          })
          return isDuplicate
        }

        // All new interests without duplicates.
        const withoutDuplicates: Interest[] = []
        allNewInterests.forEach((a: Interest) => {
          // Test if interest is not a duplicate.
          if (!isDuplicate(a, withoutDuplicates)) {
            // Push interest to list of new interests.
            withoutDuplicates.push(a)
          }
        })

        setInterests(withoutDuplicates)
      }}
      inputValue={interestInputValue}
      onInputChange={(e, value: string) => {
        // Test if value is greater than max length.
        if (value.length > MAX_INTEREST_LENGTH) {
          value = value.substring(0, MAX_INTEREST_LENGTH)
        }
        setInterestInputValue(value)
      }}
      renderOption={(interest) => `${interest.category}: ${interest.title}`}
      renderTags={(interest: Interest[], getTagProps) =>
        interest.map(({ category, title }: Interest, index: number) => (
          <Chip
            key={`${category}:${title}-${index}`}
            variant="outlined"
            label={`${category}: ${title}`}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label="Interests" variant="outlined" />
      )}
    />,
  ]

  const handleSaveContent = () => {
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
      .catch((error) => {
        console.log(error)
        setErrorMessage(error)
      })
  }

  const handleEditContent = () => {
    toggleEditMode(true)
  }

  const handleCancelEdit = () => {
    setErrorMessage("")
    toggleEditMode(false)

    // Reset editable content values.
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
                <Avatar
                  src={""}
                  className={classes.profileAvatar}
                />
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
                <Typography className={classes.error}>
                  {errorMessage}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={handleSaveContent}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <ProfileContent readonlyContent={readonlyContent} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleEditContent}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  )
}
