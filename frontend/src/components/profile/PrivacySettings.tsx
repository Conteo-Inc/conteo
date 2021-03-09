import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import type { PrivacySetters } from "../../utils/profile"
import { Grid, Button, Paper, Typography } from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"

export type PrivacySetting = "Public" | "Private" | "Hidden"

type PrivacySettingsProps = {
  readonlySettings: PrivacySettingsType
  privacySetters: PrivacySetters
  handleSaveSettings: (
    onSuccess: () => void,
    onFailure: (error: string) => void
  ) => void
}

// A user's privacy settings.
export type PrivacySettingsType = {
  first_name: PrivacySetting
  last_name: PrivacySetting
  birth_date: PrivacySetting
  gender: PrivacySetting
  interests: PrivacySetting
}

// A field listed in the settings.
type PrivacyField = {
  title: string
  privacy_level: PrivacySetting
  handleChange: (value: PrivacySetting) => void
}

const useStyles = makeStyles({
  field: {
    fontSize: "2rem",
    marginBottom: 15,
  },
  fieldsContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  button: {
    margin: 5,
  },
})

export default function PrivacySettings({
  readonlySettings,
  privacySetters,
  handleSaveSettings,
}: PrivacySettingsProps): JSX.Element {
  const classes = useStyles()
  const [isEditMode, toggleEditMode] = React.useState<boolean>(false)
  const [errMessage, seterrMessage] = React.useState<string>("")

  // User profile privacy field list.
  const fields: PrivacyField[] = [
    {
      title: "First Name",
      privacy_level: readonlySettings.first_name,
      handleChange: (value: PrivacySetting) =>
        privacySetters.setFirstName(value),
    },
    {
      title: "Last Name",
      privacy_level: readonlySettings.last_name,
      handleChange: (value: PrivacySetting) =>
        privacySetters.setLastName(value),
    },
    {
      title: "Birthday",
      privacy_level: readonlySettings.birth_date,
      handleChange: (value: PrivacySetting) =>
        privacySetters.setBirthDate(value),
    },
    {
      title: "Gender",
      privacy_level: readonlySettings.gender,
      handleChange: (value: PrivacySetting) => privacySetters.setGender(value),
    },
    {
      title: "Interests",
      privacy_level: readonlySettings.interests,
      handleChange: (value: PrivacySetting) =>
        privacySetters.setInterests(value),
    },
  ]

  const handleEditFields = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    console.log(isEditMode)
    toggleEditMode(true)
    console.log(isEditMode)
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
    handleSaveSettings(() => {
      toggleEditMode(false)
    }, seterrMessage)
  }

  return (
    <div>
      <Paper className={classes.fieldsContainer}>
        <form onSubmit={handleSaveFields}>
          <Grid container justify="center">
            <Grid item xs={10}>
              <Grid container justify="space-between">
                {fields.map(
                  ({ title, privacy_level, handleChange }: PrivacyField) => (
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
                          aria-label="privacy"
                          name="privacy"
                          defaultValue={privacy_level}
                          onChange={(e) => {
                            handleChange(
                              e.currentTarget.value as PrivacySetting
                            )
                          }}
                          row
                        >
                          <FormControlLabel
                            value="Public"
                            disabled={!isEditMode && privacy_level !== "Public"}
                            control={<Radio color="primary" />}
                            label="Public"
                            labelPlacement="top"
                          />
                          <FormControlLabel
                            value="Private"
                            disabled={
                              !isEditMode && privacy_level !== "Private"
                            }
                            control={<Radio color="secondary" />}
                            label="Private"
                            labelPlacement="top"
                          />
                          <FormControlLabel
                            value="Hidden"
                            disabled={!isEditMode && privacy_level !== "Hidden"}
                            control={<Radio color="default" />}
                            label="Hidden"
                            labelPlacement="top"
                          />
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
