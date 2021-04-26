import * as React from "react"
import { useState } from "react"
import {
  TextField,
  Grid,
  makeStyles,
  Button,
  Typography,
} from "@material-ui/core"
import { request } from "../utils/fetch"

const useStyles = makeStyles({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: "8px",
    },
  },
  pageSideBar: {
    margin: "8px",
    padding: "50px",
    backgroundColor: "rgb(238,235,228)",
  },
  pageContent: {
    margin: "10px",
    padding: "80px",
    backgroundColor: "rgb(234,232,224)",
  },
  submitButton: {
    margin: "1px",
  },
  cancelButton: {
    margin: "1px",
  },
  sideBar: {
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    "@media (min-width:1100px)": {
      fontSize: "1.5rem",
    },
  },
})

const contactValue = {
  name: "",
  email: "",
  message: "",
}

export default function ContactUs(): JSX.Element {
  const [values, setValues] = useState(contactValue)
  const classes = useStyles()

  const handleSubmit = (e: any) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
    return request({
      path: "/api/contact/",
      method: "post",
      body: contactValue,
    }).then(e.preventDefault())
  }

  return (
    <>
      <Grid container>
        <Grid item className={classes.pageSideBar}>
          <Grid container spacing={2} direction="column" justify="center">
            <Grid item>
              <Typography className={classes.sideBar}>
                Report a Video
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.sideBar}>
                Report an Issue
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.sideBar}>
                Provide Feedback
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.sideBar}>
                Report a Profile
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={classes.sideBar}>FAQs</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item className={classes.pageContent}>
          <form className={classes.root}>
            <Grid container spacing={2} direction="column" justify="center">
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Your name"
                  name="name"
                  value={values.name}
                  onChange={handleSubmit}
                />
                <TextField
                  variant="outlined"
                  label="Your email"
                  name="email"
                  value={values.email}
                  onChange={handleSubmit}
                />
                <TextField
                  variant="outlined"
                  label="Type your message here"
                  name="message"
                  multiline
                  rowsMax={6}
                  value={values.message}
                  onChange={handleSubmit}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.submitButton}
                  size="large"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.cancelButton}
                  size="large"
                  type="reset"
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  )
}
