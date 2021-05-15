import * as React from "react"
import {
  makeStyles,
  Grid,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core"
import { request } from "../utils/fetch"
import type { PrivacySetters } from "../utils/profile"
import { usePrivacySettings } from "../utils/profile"
import { ButtonStyle } from "../utils/colors"

// A user's privacy settings.
export type PrivacySettingsType = {
  first_name: PrivacyKey
  last_name: PrivacyKey
  birth_date: PrivacyKey
  gender: PrivacyKey
  interests: PrivacyKey
  profile: number
}

export type PrivacyKey = "" | "PU" | "PR" | "HI"

export type PrivacyValue = "Public" | "Private" | "Hidden"

type PrivacyChoice = {
  [key: string]: PrivacyValue
}

export const PRIVACY_CHOICES: PrivacyChoice = {
  PU: "Public",
  PR: "Private",
  HI: "Hidden",
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: "5px 20px 100px 20px",
  },
  pageTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  fieldsContainer: {
    paddingTop: "40px",
    paddingBottom: "10px",
  },
  field: {
    marginBottom: "15px",
  },
  button: {
    margin: "5px",
    //This is weird, but it's not recognizing that `ButtonStyle` is defined otherwise
    //So the first spread puts it into an anon object
    //and the second puts it into the css object
    ...{ ...ButtonStyle },
  },
  error: {
    color: "red",
  },
})

// A field listed in the settings.
type PrivacyField = {
  title: string
  readonlyPrivacyLevel: PrivacyKey
  editablePrivacyLevel: PrivacyKey
  setPrivacyLevel: (value: PrivacyKey) => void
}

type PrivacySettingsFieldProps = {
  readonlySettings: PrivacySettingsType
  editableSettings: PrivacySettingsType
  privacySetters: PrivacySetters
  isEditMode: boolean
}

function buildPrivacyFieldsJsx({
  readonlySettings,
  editableSettings,
  privacySetters: {
    setFirstName,
    setLastName,
    setBirthDate,
    setGender,
    setInterests,
  },
  isEditMode,
}: PrivacySettingsFieldProps): JSX.Element {
  const classes = useStyles()

  // User profile privacy field list.
  const fields: PrivacyField[] = [
    {
      title: "First Name",
      readonlyPrivacyLevel: readonlySettings.first_name,
      editablePrivacyLevel: editableSettings.first_name,
      setPrivacyLevel: setFirstName,
    },
    {
      title: "Last Name",
      readonlyPrivacyLevel: readonlySettings.last_name,
      editablePrivacyLevel: editableSettings.last_name,
      setPrivacyLevel: setLastName,
    },
    {
      title: "Birthday",
      readonlyPrivacyLevel: readonlySettings.birth_date,
      editablePrivacyLevel: editableSettings.birth_date,
      setPrivacyLevel: setBirthDate,
    },
    {
      title: "Gender",
      readonlyPrivacyLevel: readonlySettings.gender,
      editablePrivacyLevel: editableSettings.gender,
      setPrivacyLevel: setGender,
    },
    {
      title: "Interests",
      readonlyPrivacyLevel: readonlySettings.interests,
      editablePrivacyLevel: editableSettings.interests,
      setPrivacyLevel: setInterests,
    },
  ]

  return (
    <Paper className={classes.fieldsContainer}>
      <Grid container justify="center">
        <Grid item xs={10}>
          <Grid container justify="space-between">
            {fields.map(
              ({
                title,
                readonlyPrivacyLevel,
                editablePrivacyLevel,
                setPrivacyLevel,
              }: PrivacyField) => {
                const id = title.replace(/\s/g, "")
                return (
                  <Grid
                    key={`readonlyField-${id}`}
                    item
                    container
                    className={classes.field}
                    alignItems="flex-start"
                    justify="space-between"
                    sm={10}
                    md={5}
                  >
                    <Grid item xs={3}>
                      <Typography>{title}</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <RadioGroup
                        row
                        aria-label={`${id}Privacy`}
                        name={`${id}Privacy`}
                        value={
                          isEditMode
                            ? editablePrivacyLevel
                            : readonlyPrivacyLevel
                        }
                        onChange={(e) =>
                          setPrivacyLevel(e.currentTarget.value as PrivacyKey)
                        }
                      >
                        {Object.keys(PRIVACY_CHOICES).map((key) => (
                          <FormControlLabel
                            key={`privacyChoice-${key}`}
                            disabled={
                              !isEditMode && readonlyPrivacyLevel !== key
                            }
                            value={key}
                            label={PRIVACY_CHOICES[key]}
                            labelPlacement="top"
                            control={
                              <Radio
                                color={isEditMode ? "primary" : "default"}
                              />
                            }
                          />
                        ))}
                      </RadioGroup>
                    </Grid>
                  </Grid>
                )
              }
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default function PrivacySettings(): JSX.Element {
  const classes = useStyles()
  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // Privacy settings hooks.
  const [
    readonlySettings,
    setPrivacySettings,
  ] = React.useState<PrivacySettingsType>({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    interests: "",
    profile: -1,
  })
  const { editableSettings, privacySetters } = usePrivacySettings(
    readonlySettings
  )

  React.useEffect(() => {
    request<PrivacySettingsType>({ path: "/api/privacy/", method: "get" })
      .then((res) => {
        const privacy = res.parsedBody
        const privacySettings: PrivacySettingsType = {
          first_name: privacy.first_name,
          last_name: privacy.last_name,
          birth_date: privacy.birth_date,
          gender: privacy.gender,
          interests: privacy.interests,
          profile: privacy.profile,
        }

        setPrivacySettings(privacySettings)
        privacySetters.setFirstName(privacySettings.first_name)
        privacySetters.setLastName(privacySettings.last_name)
        privacySetters.setBirthDate(privacySettings.birth_date)
        privacySetters.setGender(privacySettings.gender)
        privacySetters.setInterests(privacySettings.interests)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleSaveSettings = () => {
    request({
      path: "/api/privacy/",
      method: "put",
      body: editableSettings,
    })
      .then(() => {
        setPrivacySettings(editableSettings)
        toggleEditMode(false)
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage("Error while saving privacy settings.")
      })
  }

  const handleEditFields = () => {
    toggleEditMode(true)
  }

  const handleCancelEdit = () => {
    setErrorMessage("")
    toggleEditMode(false)

    // Reset editable privacy settings.
    privacySetters.setFirstName(readonlySettings.first_name)
    privacySetters.setLastName(readonlySettings.last_name)
    privacySetters.setBirthDate(readonlySettings.birth_date)
    privacySetters.setGender(readonlySettings.gender)
    privacySetters.setInterests(readonlySettings.interests)
  }

  const privacyFieldsJsx = buildPrivacyFieldsJsx({
    readonlySettings,
    editableSettings,
    privacySetters,
    isEditMode,
  })

  return (
    <Grid
      container
      className={classes.root}
      justify="center"
      direction="column"
    >
      <Grid item xs={12}>
        <Typography className={classes.pageTitle}>Privacy Settings</Typography>
      </Grid>
      <Grid item xs={12}>
        {privacyFieldsJsx}
      </Grid>
      {isEditMode ? (
        <Grid container justify="center">
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
                  onClick={handleSaveSettings}
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
        <Grid container justify="center">
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={handleEditFields}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}
