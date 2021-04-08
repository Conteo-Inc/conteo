/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react"
import {
  Grid,
  makeStyles,
  Button,
  Typography,
  TextField,
} from "@material-ui/core"
import { useState } from "react"
import { request } from "../utils/fetch"
import Notification from "../components/Notification"
import { NotificationType } from "../components/Notification"
import { Nullable } from "../utils/context"

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
  const [type, setType] = useState<NotificationType["type"]>("success")
  const [message, setMessage] = useState(
    "A verication code has been sent to your email"
  )

  const handleSave = () => {
    // editModeOn(false)
  }

  const handleClose = () => {
    // editModeOn(false)
  }

  //   const handleClose = () => {
  //     setIsModalOpen(false)
  //   }

  // request({ path: "/api/accounts/", method: "get" }).then((res) => {
  //   const account: any = res.parsedBody
  //   const content: UserAccounts = {
  //     first_name: account.first_name,
  //     last_name: account.last_name,
  //     username: account.username,
  //     password: account.password,
  //     email: account.email,
  //     successor: account.successor,
  //   }
  //   setAccountData(content)
  // })

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.topBar}
      >
        <Typography variant="h5">Find your Conteo account</Typography>
        <form className={classes.root} onSubmit={handleSave}>
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
        <Notification
          isOpen={isOpen}
          type={type}
          message={message}
          setisOpen={setIsOpen}
          handleClose={handleClose}
        />
      </Grid>
    </>
  )
}
