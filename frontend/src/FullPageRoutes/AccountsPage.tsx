import * as React from "react"
import {
  Grid,
  makeStyles,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import { useState, useEffect, useReducer } from "react"
import AbstractModal from "../components/AbstractModal"
import { request } from "../utils/fetch"
import { useHistory } from "react-router-dom"
import { useUser } from "../utils/context"

const initAccountData = {
  first_name: "",
  last_name: "",
  username: "",
  password: "",
  email: "",
  successor: "",
}

const useStyles = makeStyles({
  root: {
    "& .MuiFormControl-root": {
      width: "100%",
      margin: "8px",
    },
  },
  topBar: {
    margin: "1px",
    padding: "50px",
    backgroundColor: "rgb(238,235,228)",
  },
  pageContent: {
    margin: "8px",
    padding: "110px",
  },
  button: {
    margin: "5px",
  },
})

export default function AccountsPage(): JSX.Element {
  const classes = useStyles()
  const [editMode, editModeOn] = useState(false)
  const [value, setValues] = useState("")
  const [btnText, setBtnText] = useState("Delete or Deactivate Account")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const history = useHistory()
  const { logout } = useUser()
  const [accountData, dispatch] = useReducer(
    (
      state: typeof initAccountData,
      action: Partial<typeof initAccountData>
    ) => {
      return { ...state, ...action }
    },
    initAccountData
  )

  const handleEdit = () => {
    editModeOn(!editMode)
  }

  const handleSave = () => {
    editModeOn(false)
    setIsModalOpen(false)
    if (value === "Deactivating Account") {
      request({
        path: "/api/profile/",
        method: "patch",
        body: { paused: true },
      })
        .then(logout)
        .then(() => history.push("/tokens"))
    }
  }

  const handleCancel = () => {
    editModeOn(false)
  }

  const handleDeleteChanges = (event: any) => {
    setValues(event.target.value)
  }

  const handleAccountChanges = (event: any) => {
    event.preventDefault()

    if (value === "Deactivating Account") {
      setBtnText("Deactivate Account")
      setIsModalOpen(true)
    } else if (value === "Delete Account") {
      setBtnText("Delete Account")
      setIsModalOpen(true)
    } else {
      setBtnText("Delete or Deactivate Account")
      setIsModalOpen(false)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    request<typeof initAccountData>({
      path: "/api/accounts/",
      method: "get",
    }).then((res) => {
      dispatch(res.parsedBody)
    })
  }, [])

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.topBar}
    >
      <Grid container item justify="center">
        <Typography variant="h4">Accounts Settings</Typography>
      </Grid>

      <Grid item>
        <form className={classes.root} onSubmit={handleSave}>
          <Grid container className={classes.pageContent} spacing={5}>
            <Grid item xs={6}>
              <TextField
                name="firstName"
                label="First Name"
                variant="outlined"
                value={accountData.first_name}
                onChange={(e) =>
                  dispatch({ first_name: e.currentTarget.value })
                }
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                name="username"
                label="Username"
                variant="outlined"
                value={accountData.username}
                onChange={(e) => dispatch({ username: e.currentTarget.value })}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                value={accountData.email}
                onChange={(e) => dispatch({ email: e.currentTarget.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleEdit}>
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={accountData.last_name}
                onChange={(e) => dispatch({ last_name: e.currentTarget.value })}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                value={accountData.password}
                onChange={(e) => dispatch({ password: e.currentTarget.value })}
                autoComplete="current-password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleEdit}>
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                name="sucessor"
                label="Account Successor Email"
                variant="outlined"
                type="email"
                value={accountData.successor}
                onChange={(e) => dispatch({ successor: e.currentTarget.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleEdit}>
                        <EditIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Save
              </Button>
              <Button
                variant="contained"
                className={classes.button}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          <Divider />
        </form>
      </Grid>
      <Grid container item justify="center">
        <Typography variant="h5">Deactivate or Delete Account</Typography>
      </Grid>
      <Grid item>
        <form onSubmit={handleAccountChanges}>
          <Grid container>
            <Grid item></Grid>
            <FormControl>
              <RadioGroup
                name="accountDelete"
                value={value}
                onChange={handleDeleteChanges}
              >
                <FormControlLabel
                  value="Deactivating Account"
                  control={<Radio />}
                  label="Deactivate Account"
                />
                <FormHelperText>
                  Your account would be temporarily disabled.
                </FormHelperText>
                <FormControlLabel
                  value="Delete Account"
                  control={<Radio />}
                  label="Delete Account"
                />
                <FormHelperText>
                  Your account would be deleted permanently.
                </FormHelperText>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              className={classes.button}
              onClick={handleAccountChanges}
            >
              {btnText}
            </Button>
            <AbstractModal
              isModalOpen={isModalOpen}
              handleConfirm={handleSave}
              handleCancel={handleClose}
              title="Confirmation"
              description={`Are you sure you want to ${btnText}?`}
            />
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
