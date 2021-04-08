import * as React from "react"
import { Grid, Button, Paper, Typography } from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import { makeStyles } from "@material-ui/core/styles"
import { request } from "../../utils/fetch"
import type { PrivacySetters } from "../../utils/profile"
import { getPrivacySettingsUpdates } from "../../utils/profile"

type PrivacySettingsProps = {
  readonlySettings: PrivacySettingsType
  editableSettings: PrivacySettingsType
  privacySetters: PrivacySetters
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettingsType>>
  userId: number
}

// A user's privacy settings.
export type PrivacySettingsType = {
  first_name_privacy: PrivacyKey
  last_name_privacy: PrivacyKey
  birth_date_privacy: PrivacyKey
  gender_privacy: PrivacyKey
  interests_privacy: PrivacyKey
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

// A field listed in the settings.
type PrivacyField = {
  title: string
  privacy_level: PrivacyKey
  setPrivacyLevel: (value: PrivacyKey) => void
}

const useStyles = makeStyles({
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
  },
  error: {
    color: "red",
  },
})

export default function PrivacySettings({
  readonlySettings,
  editableSettings,
  privacySetters: {
    setFirstNamePrivacy,
    setLastNamePrivacy,
    setBirthDatePrivacy,
    setGenderPrivacy,
    setInterestsPrivacy,
  },
  setPrivacySettings,
  userId,
}: PrivacySettingsProps): JSX.Element {
  const classes = useStyles()
  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string>("")

  // User profile privacy field list.
  const fields: PrivacyField[] = [
    {
      title: "First Name",
      privacy_level: readonlySettings.first_name_privacy,
      setPrivacyLevel: setFirstNamePrivacy,
    },
    {
      title: "Last Name",
      privacy_level: readonlySettings.last_name_privacy,
      setPrivacyLevel: setLastNamePrivacy,
    },
    {
      title: "Birthday",
      privacy_level: readonlySettings.birth_date_privacy,
      setPrivacyLevel: setBirthDatePrivacy,
    },
    {
      title: "Gender",
      privacy_level: readonlySettings.gender_privacy,
      setPrivacyLevel: setGenderPrivacy,
    },
    {
      title: "Interests",
      privacy_level: readonlySettings.interests_privacy,
      setPrivacyLevel: setInterestsPrivacy,
    },
  ]

  const handleSaveSettings = () => {
    const updates = getPrivacySettingsUpdates(
      readonlySettings,
      editableSettings
    )
    request({
      path: `/api/privacy/${userId}/`,
      method: "put",
      body: { profile: userId, ...updates },
    })
      .then(() => {
        setPrivacySettings(editableSettings)
        toggleEditMode(false)
      })
      .catch((error) => {
        setErrorMessage(error)
      })
  }

  const handleEditFields = () => {
    toggleEditMode(true)
  }

  const handleCancelEdit = () => {
    setErrorMessage("")
    toggleEditMode(false)

    // Reset editable privacy settings.
    setFirstNamePrivacy(readonlySettings.first_name_privacy)
    setLastNamePrivacy(readonlySettings.last_name_privacy)
    setBirthDatePrivacy(readonlySettings.birth_date_privacy)
    setGenderPrivacy(readonlySettings.gender_privacy)
    setInterestsPrivacy(readonlySettings.interests_privacy)
  }

  return (
    <>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="baseline" justify="flex-start">
            <Grid item xs={12}>
              <Typography className={classes.pageTitle}>
                Privacy Settings
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.fieldsContainer}>
            <Grid container justify="center">
              <Grid item xs={10}>
                <Grid container justify="space-between">
                  {fields.map(
                    ({
                      title,
                      privacy_level,
                      setPrivacyLevel,
                    }: PrivacyField) => (
                      <Grid
                        key={`readonlyField-${title}`}
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
                            aria-label="Privacy"
                            name="Privacy"
                            defaultValue={privacy_level}
                            onChange={(e) =>
                              setPrivacyLevel(
                                e.currentTarget.value as PrivacyKey
                              )
                            }
                          >
                            {Object.keys(PRIVACY_CHOICES).map((key) => (
                              <FormControlLabel
                                key={`privacyChoice-${key}`}
                                disabled={!isEditMode && privacy_level !== key}
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
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
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
    </>
  )
}
