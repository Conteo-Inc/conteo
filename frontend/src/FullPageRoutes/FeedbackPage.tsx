import * as React from "react"
import { useState } from "react"
import {
  makeStyles,
  Typography,
  Select,
  TextField,
  Grid,
  Button,
} from "@material-ui/core"
import { useHistory } from "react-router-dom"
import { request } from "../utils/fetch"

const useStyles = makeStyles({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: "10px",
    },
    minWidth: "200px",
  },
  submitButton: {
    margin: "1px",
  },
  cancelButton: {
    margin: "1px",
  },
  pageContent: {
    margin: "8px",
    padding: "110px",
    backgroundColor: "rgb(234,232,224)",
  },
})

const feedBackValue = {
  reason: "",
  message: "",
  email: "",
}

export default function FeedbackPage(): JSX.Element {
  const [values, setValues] = useState(feedBackValue)
  const classes = useStyles()
  const history = useHistory()

  const handleSubmit = (e: any) => {
    e.preventDefault().then(history.push("/help"))
  }

  const setFeedbackValue = (e: any) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
    return request({
      path: "/api/feedback/",
      method: "post",
      body: feedBackValue,
    })
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.pageContent}
      >
        <Grid item justify="center">
          <Typography variant="h3">Feedback</Typography>
          <Typography variant="h4">Send us your feedback</Typography>
          <Typography variant="h5">
            Do you have a suggestion or found some bug?
          </Typography>
          <Typography variant="h5">Let us know in the field below.</Typography>
        </Grid>

        <Grid item xs={12}>
          <form className={classes.root}>
            <Grid container spacing={2} direction="column" justify="center">
              <Grid item xs={12}>
                <label>Reason for feedback</label>
                <Select
                  id="reasons"
                  name="reasons"
                  value={values.reason}
                  onChange={setFeedbackValue}
                >
                  <option aria-label="None" value="" />
                  <option value={"website"}>Website</option>
                  <option value={"penpal"}>Penpal</option>
                  <option value={"performance"}>Performance</option>
                </Select>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Type your message here"
                  name="message"
                  multiline
                  rowsMax={6}
                  value={values.message}
                  onChange={setFeedbackValue}
                />
                <TextField
                  variant="outlined"
                  label="Your email"
                  name="email"
                  value={values.email}
                  onChange={setFeedbackValue}
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
                  Send Feedback
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
