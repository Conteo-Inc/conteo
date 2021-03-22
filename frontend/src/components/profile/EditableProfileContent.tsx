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
import CameraAltIcon from "@material-ui/icons/CameraAlt"
import VideocamIcon from "@material-ui/icons/Videocam"
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

const pictureSize = 200
const useStyles = makeStyles({
  circle: {
    borderRadius: "50%",
  },
  overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    opacity: "0%",
    "&:hover": {
      opacity: "25%",
    },
  },
  iconContainer: {
    position: "absolute",
    bottom: 3,
    right: 3,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    cursor: "pointer",
    boxShadow: "0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%)",
  },
  blur: {
    height: "25%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(200, 200, 200, 0.5)",
    filter: "blur(8px)",
  },
  item: {
    height: pictureSize,
    width: pictureSize,
    position: "relative",
    cursor: "pointer",
  },
  picture: {
    height: "100%",
    width: "100%",
  },
  cameraContainer: {
    height: pictureSize / 4,
    width: pictureSize / 4,
    borderRadius: "50%",
  },
  cameraIconItem: {
    height: "75%",
    width: "75%",
  },
  cameraIcon: {
    height: "100%",
    width: "100%",
    color: "white",
  },
  videoItem: {
    width: "auto",
  },
  video: {
    height: pictureSize,
  },
  videoCamContainer: {
    maxHeight: "auto",
    width: "auto",
    borderRadius: 16,
  },
  videoCamIconItem: {
    height: 25,
    width: 25,
    margin: 5,
  },
  videoCamIcon: {
    height: "100%",
    width: "100%",
    color: "white",
  },
  recordVideoText: {
    margin: 5,
    color: "white",
    textShadow: "1px 1px 3px black",
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
    color: "white",
    backgroundColor: Colors.DEEP_BLUE,
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

  const uploadImage = () => {
    console.log("upload image")
  }

  const recordIntroVideo = () => {
    console.log("record intro video")
  }

  return (
    <div>
      {isEditMode ? (
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justify="space-evenly">
              <Grid item className={classes.item} onClick={uploadImage}>
                <Avatar src={""} className={classes.picture} />
                <div className={`${classes.overlay} ${classes.circle}`}></div>
                <Grid
                  container
                  alignItems="center"
                  justify="center"
                  className={`${classes.iconContainer} ${classes.cameraContainer}`}
                >
                  <Grid item className={classes.cameraIconItem}>
                    <CameraAltIcon className={classes.cameraIcon} />
                  </Grid>
                </Grid>
              </Grid>
              {editableContent.video ? (
                <Grid
                  item
                  className={`${classes.item} ${classes.videoItem}`}
                  onClick={recordIntroVideo}
                >
                  <video
                    src={editableContent.video}
                    className={classes.video}
                  />
                  <div className={classes.blur}></div>
                  <div className={classes.overlay}></div>
                  <Grid
                    container
                    alignItems="center"
                    justify="flex-end"
                    className={`${classes.iconContainer} ${classes.videoCamContainer}`}
                  >
                    <Grid item className={classes.videoCamIconItem}>
                      <VideocamIcon className={classes.videoCamIcon} />
                    </Grid>
                    <Grid item className={classes.recordVideoText}>
                      <Typography>Record Intro Video</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item>
                  <Button
                    className={classes.recordButton}
                    size="large"
                    component={Link}
                    to={`/record/${userId}`}
                  >
                    <Typography variant="h6">Record Intro Video</Typography>
                  </Button>
                </Grid>
              )}
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
