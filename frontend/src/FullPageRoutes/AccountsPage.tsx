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
import { useState, useEffect } from "react"
import AbstractModal from "../components/AbstractModal"
import { request } from "../utils/fetch"

export type UserAccounts = {
  first_name: string
  last_name: string
  username: string
  password: string
  email: string
  successor: string
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

  const [accountData, setAccountData] = useState<UserAccounts>({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    email: "",
    successor: "",
  })

  const handleEdit = () => {
    editModeOn(!editMode)
  }

  const handleSave = () => {
    editModeOn(false)
    setIsModalOpen(false)
    request({
      path: "/api/accounts/",
      method: "put",
      body: { is_active: value === "Deactivating Account" ? false : undefined },
    })
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
    request({ path: "/api/accounts/", method: "get" }).then((res) => {
      const account: any = res.parsedBody
      const content: UserAccounts = {
        first_name: account.first_name,
        last_name: account.last_name,
        username: account.username,
        password: account.password,
        email: account.email,
        successor: account.successor,
      }
      setAccountData(content)
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
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                name="username"
                label="Username"
                variant="outlined"
                value={accountData.username}
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
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                value={accountData.password}
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
