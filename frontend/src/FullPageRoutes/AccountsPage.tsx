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
import { request, parseIdentity } from "../utils/fetch"
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

enum Action {
  DELETE = "delete",
  DEACTIVATE = "deactivate",
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
  error: {
    color: "red",
  },
})

export default function AccountsPage(): JSX.Element {
  const classes = useStyles()
  const [editMode, editModeOn] = useState(false)
  const [btnText, setBtnText] = useState("Delete or Deactivate Account")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [accountAction, setAccountAction] = useState<Action | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const { logout } = useUser()
  const history = useHistory()
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
  }

  const handleCancel = () => {
    editModeOn(false)
  }

  const handleAccountChanges = (event: any) => {
    event.preventDefault()

    if (accountAction === Action.DEACTIVATE) {
      setBtnText("Deactivate Account")
      setIsModalOpen(true)
    } else if (accountAction === Action.DELETE) {
      setBtnText("Delete Account")
      setIsModalOpen(true)
    } else {
      setBtnText("Delete or Deactivate Account")
      setIsModalOpen(false)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setAccountAction(null)
  }

  const handleConfirm = () => {
    if (accountAction === Action.DELETE) {
      deleteAccount()
    } else if (accountAction === Action.DEACTIVATE) {
      deactivateAccount()
    } else {
      setIsModalOpen(false)
    }
    setAccountAction(null)
  }

  const deleteAccount = () => {
    logout()
    request({
      path: "/api/deleteaccount/",
      method: "delete",
      parser: parseIdentity,
    })
      .then(() => {
        setIsModalOpen(false)
        history.push("/tokens")
      })
      .catch((error) => {
        console.log(error)
        setErrorMessage("Error while deleting account.")
      })
  }

  const deactivateAccount = () => {
    request({
      path: "/api/profile/",
      method: "patch",
      body: { paused: true },
    })
      .then(logout)
      .then(() => history.push("/tokens"))
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
                value={accountAction}
                onChange={(e) =>
                  setAccountAction(e.currentTarget.value as Action)
                }
              >
                <FormControlLabel
                  value={Action.DEACTIVATE}
                  control={<Radio />}
                  label="Deactivate Account"
                />
                <FormHelperText>
                  Your account would be temporarily disabled.
                </FormHelperText>
                <FormControlLabel
                  value={Action.DELETE}
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
            >
              {btnText}
            </Button>
            <AbstractModal
              isModalOpen={isModalOpen}
              handleConfirm={handleConfirm}
              handleCancel={handleClose}
              title="Confirmation"
              description={`Are you sure you want to ${btnText}?`}
            >
              <Typography className={classes.error}>{errorMessage}</Typography>
            </AbstractModal>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}
