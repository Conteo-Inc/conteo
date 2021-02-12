import * as React from "react"
import { request } from "../utils/fetch"
import { makeStyles } from "@material-ui/core/styles"
import type { ProfileContentSetters } from "../utils/profile"
import { Grid, Avatar, Typography, TextField, Button, Paper } from "@material-ui/core"

type SaveProfileResponse = {
  token: string
}

type ProfileContentProps = {
  editableContent: ProfileContentType
  setters: ProfileContentSetters
  readonlyContent: ProfileContentType
  setProfile: React.Dispatch<React.SetStateAction<ProfileContentType>>
}

// This is what the ProfileContent component expects to receive from storage.
export type ProfileContentType = {
  firstName: string
  lastName: string
  username: string
  age: number
  gender: string
  occupations: string[]
  location: string
  interests: string[]
  religion: string
  profileImg: string
}

// A field listed in the content.
type ProfileField = {
  title: string
  value: string
}

type ProfileFieldList = {
  firstName: ProfileField
  lastName: ProfileField
  username: ProfileField
  age: ProfileField
  gender: ProfileField
  occupations: ProfileField
  location: ProfileField
  interests: ProfileField
  religion: ProfileField
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

export default function ProfileContent(
  props: ProfileContentProps
): JSX.Element {
  const { editableContent, setters, readonlyContent, setProfile } = props
  const [isEditMode, toggleEditMode] = React.useState(false)
  const [errMessage, seterrMessage] = React.useState<string>("")
  const classes = useStyles()

  // User profile field list. Field values are assigned to readonly content.
  // TODO: consider removing type ProfileFieldList and making fields an
  //  array of ProfileField. This requires each field to provide custom
  //  TextField jsx.
  const fields: ProfileFieldList = {
    firstName: {
      title: "First Name",
      value: readonlyContent.firstName,
    },
    lastName: {
      title: "Last Name",
      value: readonlyContent.lastName,
    },
    username: {
      title: "Username",
      value: readonlyContent.username,
    },
    age: {
      title: "Age",
      value: readonlyContent.age.toString(),
    },
    gender: {
      title: "Gender",
      value: readonlyContent.gender,
    },
    occupations: {
      title: "Occupations",
      value: readonlyContent.occupations.join(", "),
    },
    location: {
      title: "Location",
      value: readonlyContent.location,
    },
    interests: {
      title: "Interests",
      value: readonlyContent.interests.join(", "),
    },
    religion: {
      title: "Religion",
      value: readonlyContent.religion,
    },
  }

  const handleEditBtnClick = (e) => {
    e.preventDefault()
    toggleEditMode(true)
  }

  const handleCancelBtnClick = (e) => {
    e.preventDefault()
    seterrMessage("")
    toggleEditMode(false)
  }

  const saveFields = (e) => {
    e.preventDefault()
    React.useEffect(() => {
      request<SaveProfileResponse>("/api/current_user/", "post", true, true)
        .then((json) => {
          setProfile(editableContent)
          toggleEditMode(false)
          seterrMessage("")
        }).catch(err => {
          seterrMessage(err)
        })
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid item className={classes.profileHeader} xs={12}>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Avatar src={readonlyContent.profileImg} className={classes.profileAvatar} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className={classes.introVideo}>Intro Video</div>
          </Grid>
        </Grid>
      </Grid>
      {!isEditMode &&
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={2}>
              {Object.keys(fields).map(function (key) {
                const field: ProfileField = fields[key]
                const { title, value } = field

                return (
                  <Grid key={key} container item justify="flex-end" className={classes.field} sm={12} md={6}>
                    <Grid item xs={9}>
                      <Typography>{title}: {value}</Typography>
                    </Grid>
                  </Grid>
                )
              })}
              <Grid container item justify="center" xs={12}>
                <Grid item>
                  <Button variant="contained" color="secondary" style={{ margin: 5 }} onClick={handleEditBtnClick}>Edit</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      }
      {isEditMode &&
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={2}>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField required label={fields.firstName.title}
                    defaultValue={fields.firstName.value}
                    onChange={e => { setters.setFirstName(e.target.value) }}
                    inputProps={{ maxLength: 50 }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField required label={fields.lastName.title}
                    defaultValue={fields.lastName.value}
                    onChange={e => { setters.setLastName(e.target.value) }}
                    inputProps={{ maxLength: 50 }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField disabled label={fields.username.title}
                    defaultValue={fields.username.value}
                    onChange={e => { setters.setUsername(e.target.value) }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField disabled label={fields.age.title}
                    defaultValue={fields.age.value}
                    onChange={e => { setters.setAge(Number(e.target.value)) }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField label={fields.gender.title}
                    defaultValue={fields.gender.value}
                    onChange={e => { setters.setGender(e.target.value) }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField label={fields.occupations.title}
                    defaultValue={fields.occupations.value}
                    onChange={e => { setters.setOccupations(e.target.value.split(",")) }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField label={fields.location.title}
                    defaultValue={fields.location.value}
                    onChange={e => { setters.setLocation(e.target.value) }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField label={fields.interests.title}
                    defaultValue={fields.interests.value}
                    onChange={e => { setters.setInterests(e.target.value.split(",")) }} />
                </Grid>
              </Grid>
              <Grid container item justify="flex-end" className={classes.field} sm={12} md={6}>
                <Grid item xs={9}>
                  <TextField label={fields.religion.title}
                    defaultValue={fields.religion.value}
                    onChange={e => { setters.setReligion(e.target.value) }} />
                </Grid>
              </Grid>
              <Grid container item justify="center" xs={12}>
                <Grid item>
                  <Button variant="contained" type="submit" color="primary" style={{ margin: 5 }} onClick={saveFields}>Save</Button>
                  <Button variant="contained" style={{ margin: 5 }} onClick={handleCancelBtnClick}>Cancel</Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      }
    </Grid >
  )
}
