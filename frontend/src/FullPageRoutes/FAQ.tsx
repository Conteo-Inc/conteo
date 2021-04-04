import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  makeStyles,
  Typography,
  Grid,
} from "@material-ui/core"
import * as React from "react"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles({
  page: {
    margin: "1px",
    padding: "50px",
    backgroundColor: "rgb(238,235,228)",
  },
  topBar: {
    margin: "1px",
    padding: "50px",
    backgroundColor: "rgb(238,235,228)",
  },
  bottomBar: {
    margin: "2px",
    padding: "110px",
  },
})

export default function FAQ(): JSX.Element {
  const classes = useStyles()
  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.topBar}
      >
        <Grid item justify="center">
          <Typography variant="h4">Frequently Asked Questions</Typography>
          <Typography variant="h5">(FAQs)</Typography>
        </Grid>

        <Grid item>
          <Grid
            container
            justify="center"
            alignItems="center"
            spacing={1}
            className={classes.bottomBar}
          >
            <Grid item>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How can I sign up for Conteo?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    To sign up, go to our homepage and select the sign up
                    options. You would then be asked to provide your email and
                    password.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>Who are penpals?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Penpals are anyone you are matched to.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>
                    How many video message can be sent per day?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    One (1) video messages be per day can be sent.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How long can the video be?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    The video can be between fifteen seconds to 10 minutes long.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>What are the privacy settings?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    The privacy settings are public, private and hidden. Public
                    allows for everyone to see your information. Private allows
                    for just my penpals to see your information. Hidden allows
                    for no one to see your information.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>Can I decline a penpal?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Yes.</Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>
                    Is there a maximum of penpals I can accept in a day?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>No.</Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>Can you edit videos?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Yes.</Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
