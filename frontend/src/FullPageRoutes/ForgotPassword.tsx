import * as React from "react"
import {
  Grid,
  makeStyles,
  Button,
  Typography,
  TextField,
} from "@material-ui/core"
import { useState } from "react"
import Notification from "../components/Notification"
import { NotificationType } from "../components/Notification"
import { Nullable } from "../utils/context"
import { useHistory } from "react-router-dom"

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

export default function ForgotPassword(): JSX.Element {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = React.useState<Nullable<string>>(null)
  //   const [nextPg, setNextPg] = React.useState<Nullable<boolean>>(false)
  const [type, setType] = useState<NotificationType["type"]>("error")
  const [message, setMessage] = useState("Email does not exist")
  const history = useHistory()

  const handleSave = () => {
    setIsOpen(true)
    setType("error")
  }

  const handleClose = () => {
    setIsOpen(false)
    setMessage("")
    history.push("/resetpassword")
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.topBar}
      >
        <Typography variant="h5">Find your Conteo account</Typography>
        <form
          className={classes.root}
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <Grid container className={classes.pageContent} spacing={5}>
            <Grid item xs={6}>
              <TextField
                label="Email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email || ""}
                fullWidth
                required
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className={classes.button}
                type="submit"
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Notification
        isOpen={isOpen}
        type={type}
        message={message}
        setisOpen={setIsOpen}
        handleClose={handleClose}
      />
    </>
  )
}
