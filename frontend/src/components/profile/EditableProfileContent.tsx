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
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers"
import Autocomplete from "@material-ui/lab/Autocomplete"
import CameraAltIcon from "@material-ui/icons/CameraAlt"
import ProfileContent, { GENDER_CHOICES } from "./ProfileContent"
import type { ProfileContentType, GenderKey, Interest } from "./ProfileContent"
import UploadImageModal from "./UploadImageModal"
import Video from "../video/Video"
import { Colors } from "../../utils/colors"
import { Nullable } from "../../utils/context"
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

const MAX_FIRST_NAME_LENGTH = 50
const MAX_LAST_NAME_LENGTH = 50

const pictureSize = 200
const useStyles = makeStyles({
  profileAvatar: {
    height: "200px",
    width: "200px",
  },
  circle: {
    height: "200px",
    width: "200px",
    display: "flex",
    overflow: "hidden",
    alignItems: "center",
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
  introVideo: {
    maxHeight: "200px",
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

type EditableElementListProps = {
  editableContent: ProfileContentType
  contentSetters: ProfileContentSetters
  interestOptions: Interest[]
}

function buildEditableElementList({
  editableContent: { first_name, last_name, birth_date, gender, interests },
  contentSetters: {
    setFirstName,
    setLastName,
    setBirthDate,
    setGender,
    setInterests,
  },
  interestOptions,
}: EditableElementListProps): JSX.Element[] {
  const classes = useStyles()
  const [interestInputValue, setInterestInputValue] = React.useState<string>("")

  const isInterestEqual = (a: Interest, b: Interest): boolean => {
    return a.category === b.category && a.title === b.title
  }

  return [
    // FIRST NAME
    <TextField
      key={"editableContent-firstName"}
      required
      className={classes.textField}
      variant="outlined"
      label="First Name"
      value={first_name}
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
      value={last_name}
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
        value={birth_date}
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
        value={gender ? gender : ""}
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
      className={classes.textField}
      options={interestOptions}
      groupBy={(interest) => interest.category}
      getOptionLabel={(interest) => interest.title}
      getOptionSelected={isInterestEqual}
      value={interests}
      onChange={(e, interests: Interest[]) => setInterests(interests)}
      inputValue={interestInputValue}
      onInputChange={(e, value: string) => setInterestInputValue(value)}
      renderOption={(interest) => `${interest.category}: ${interest.title}`}
      renderTags={(interest: Interest[], getTagProps) =>
        interest.map(({ category, title }: Interest, index: number) => (
          <Chip
            key={`interestChip-${index}`}
            variant="outlined"
            label={`${category}: ${title}`}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Interests" />
      )}
    />,
  ]
}

export default function EditableProfileContent({
  readonlyContent,
  editableContent,
  contentSetters,
  setProfileContent,
  userId,
}: EditableProfileContentProps): JSX.Element {
  const classes = useStyles()

  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string>(
    ""
  )
  const [interestOptions, setInterestOptions] = React.useState<Interest[]>([])

  React.useEffect(() => {
    request<Interest[]>({ path: "/api/interests/", method: "get" })
      .then((res) => {
        const options: Interest[] = res.parsedBody
          .sort((a: Interest, b: Interest) => -b.title.localeCompare(a.title))
          .sort(
            (a: Interest, b: Interest) => -b.category.localeCompare(a.category)
          )
        setInterestOptions(options)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  // Editable user profile element list.
  const editableElements: JSX.Element[] = buildEditableElementList({
    editableContent,
    contentSetters,
    interestOptions,
  })

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
    contentSetters.setFirstName(readonlyContent.first_name)
    contentSetters.setLastName(readonlyContent.last_name)
    contentSetters.setBirthDate(readonlyContent.birth_date)
    contentSetters.setGender(readonlyContent.gender)
    contentSetters.setInterests(readonlyContent.interests)
  }
  const [
    isUploadImageModalOpen,
    toggleUploadImageModal,
  ] = React.useState<boolean>(false)

  const updateProfilePicture = (filePath: Nullable<string>) => {
    contentSetters.setImage(filePath)
    setProfileContent(editableContent)
  }

  return (
    <>
      {isEditMode ? (
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justify="space-evenly">
              <Grid
                item
                className={classes.item}
                onClick={() => toggleUploadImageModal(true)}
              >
                <Avatar
                  src={
                    editableContent.image_file !== null
                      ? editableContent.image_file
                      : ""
                  }
                  className={classes.picture}
                />
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
                <Video
                  src={editableContent.video}
                  className={classes.introVideo}
                />
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
      <UploadImageModal
        isModalOpen={isUploadImageModalOpen}
        toggleModal={toggleUploadImageModal}
        updateProfilePicture={updateProfilePicture}
      />
    </>
  )
}
