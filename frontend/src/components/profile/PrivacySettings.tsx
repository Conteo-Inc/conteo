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
    paddingTop: 40,
    paddingBottom: 10,
  },
  field: {
    marginBottom: 15,
  },
  button: {
    margin: 5,
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
  const [errMessage, seterrMessage] = React.useState<string>("")

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

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
      .catch((err) => {
        seterrMessage(err)
      })
  }

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
    setFirstNamePrivacy(readonlySettings.first_name_privacy)
    setLastNamePrivacy(readonlySettings.last_name_privacy)
    setBirthDatePrivacy(readonlySettings.birth_date_privacy)
    setGenderPrivacy(readonlySettings.gender_privacy)
    setInterestsPrivacy(readonlySettings.interests_privacy)
  }

  return (
    <div>
      <Grid container alignItems="baseline" justify="flex-start">
        <Grid item xs={12}>
          <Typography className={classes.pageTitle}>
            Privacy Settings
          </Typography>
        </Grid>
      </Grid>
      <Paper className={classes.fieldsContainer}>
        <form onSubmit={handleSaveSettings}>
          <Grid container justify="center">
            <Grid item xs={10}>
              <Grid container justify="space-between">
                {fields.map(
                  ({ title, privacy_level, setPrivacyLevel }: PrivacyField) => (
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
                          aria-label="Privacy"
                          name="Privacy"
                          defaultValue={privacy_level}
                          onChange={(e) => {
                            setPrivacyLevel(e.currentTarget.value as PrivacyKey)
                          }}
                          row
                        >
                          {Object.keys(PRIVACY_CHOICES).map((key) => (
                            <FormControlLabel
                              key={`privacyChoice-${key}`}
                              value={key}
                              disabled={!isEditMode && privacy_level !== key}
                              control={
                                <Radio
                                  color={isEditMode ? "primary" : "default"}
                                />
                              }
                              label={PRIVACY_CHOICES[key]}
                              labelPlacement="top"
                            />
                          ))}
                        </RadioGroup>
                      </Grid>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
            {isEditMode ? (
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
            ) : (
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
            )}
          </Grid>
        </form>
      </Paper>
    </div>
  )
}
