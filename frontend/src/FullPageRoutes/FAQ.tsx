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
                    options. You will then be asked to provide an email address
                    and to create a password.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>Who and what are penpals?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Penpals are other users that are in your penpal list. You
                    can send video letters to them and they can send video
                    letters to you. You can only be penpals with people that you
                    approved in your match list, and who approved you. You can
                    remove a penpal from your list if you do not want to
                    correspond with them anymore.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>
                    How many video messages can I send in a day?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    You can send one video a day to each penpal.
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
                    The privacy settings let you control what information is
                    shared with other users. Public allows anyone that you match
                    with to see that information. For instance, if you set your
                    age public, anyone you match with will see your age. Private
                    allows only your penpals to see the information. If you set
                    your age to private, only your penpals can see your age.
                    Hidden means no one but you can see the information. If you
                    set something hidden, that means it cannot be used to match
                    you with other users. For instance, if you are 33, and you
                    set your age to hidden, another user looking for penpals who
                    are 30-40 years old will not be matched to you.
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
                  <Typography>
                    You can decline as many penpals as you want. When a
                    potential penpal on appears on your matching list, you would
                    be given the option to either accept or decline the penpal.
                  </Typography>
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
                  <Typography>
                    You can accept as many penpals as you want in a day.
                    However, consider carefully how many different videos you
                    want to record. We recommend you start out with a small
                    number and add more penpals over time as you get more
                    comfortable with the service.
                  </Typography>
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
                  <Typography>
                    Yes, there are tools available to edit videos in the video
                    recording part of the site.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
