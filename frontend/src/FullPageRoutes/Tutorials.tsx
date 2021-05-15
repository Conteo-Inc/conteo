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
    // backgroundColor: "rgb(238,235,228)",
  },
  topBar: {
    margin: "1px",
    padding: "50px",
    // backgroundColor: "rgb(238,235,228)",
  },
  bottomBar: {
    margin: "2px",
    padding: "110px",
  },
  images: {
    width: "600px",
    height: "600px",
  },
  imagesText: {
    padding: "2px",
  },
})

export default function Tutorials(): JSX.Element {
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
          <Typography variant="h4">Tutorials</Typography>
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
                  <Typography>How to Sign Up?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className={classes.imagesText}>
                    Click on the Sign Up Link on the Conteo`s Homepage.
                  </Typography>
                  <img
                    src="/static/images/sign-up-link.jpg"
                    alt="Signing Up Link"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography className={classes.imagesText}>
                    Enter your email address and password.
                  </Typography>
                  <img
                    src="/static/images/sign-up.jpeg"
                    alt="Signing Up"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography className={classes.imagesText}>
                    Click Sign Up
                  </Typography>
                  <img
                    src="/static/images/sign-up-button.jpg"
                    alt="Signing Up Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography className={classes.imagesText}>
                    You will be asked to confirm your age. Once age is
                    confirmed, you would be greeting with Conteo`s Dashboard.
                  </Typography>
                  <img
                    src="/static/images/confirmation-page.png"
                    alt="Signing Up Age Confirmation"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to Record an Intro Video?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Click on My Profile on the Conteo`s Dashboard.
                  </Typography>
                  <img
                    src="/static/images/myprofile-link.jpg"
                    alt="My Profile Link"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    You would be greeted with the Profile Page.
                  </Typography>
                  <img
                    src="/static/images/profile.png"
                    alt="Profile Page"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click on the Record Intro Video and it would begin recording
                    your intro video.
                  </Typography>
                  <img
                    src="/static/images/record-intro-button.jpg"
                    alt="Record Intro Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Saves changes to Profile for your Intro video to be saved on
                    your Profile.
                  </Typography>
                  <img
                    src="/static/images/save-intro-video.jpg"
                    alt="Save Intro Video"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to Login?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Enter your email address and password.
                  </Typography>
                  <img
                    src="/static/images/sign-in-homepage.jpg"
                    alt="Signing Up Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click sign in and you would be greeted with Conteo`s
                    Dashboard.
                  </Typography>
                  <img
                    src="/static/images/sign-in-button.jpg"
                    alt="Signing Up Button"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to Contact Us?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Click on Contact Us on the top bar.</Typography>
                  <img
                    src="/static/images/contact-us-link.jpg"
                    alt="Signing Up Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    You will be greeted with a Contact Us form to complete.
                  </Typography>
                  <img
                    src="/static/images/contact-us-page.png"
                    alt="Contact Us Page"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to Edit a Video?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    You would be greeted with this screen with your recorded
                    video displayed.
                  </Typography>
                  <img
                    src="/static/images/video-edit-screen.jpg"
                    alt="Video Edit Screen"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click on the record tape to start to edit the video.
                  </Typography>
                  <img
                    src="/static/images/video-edit.jpg"
                    alt="Video Edit"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Move the lever to trim it to how short you want it.
                  </Typography>
                  <img
                    src="/static/images/video-edit-lever.jpg"
                    alt="Video Edit Lever"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click the tick button to save the trimmed video.
                  </Typography>
                  <img
                    src="/static/images/video-edit-tick.jpg"
                    alt="Video Edit Tick"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click the play button to see the trim video.
                  </Typography>
                  <img
                    src="/static/images/video-edit-play.jpg"
                    alt="Video Edit Play"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click the stop button to stop the trim video from playing.
                  </Typography>
                  <img
                    src="/static/images/video-edit-stop.jpg"
                    alt="Video Edit Stop"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click the send button to send the trim video.
                  </Typography>
                  <img
                    src="/static/images/video-edit-send.jpg"
                    alt="Video Edit Send"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to Change Privacy Settings?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Click on My Profile on the Conteo`s Dashboard.
                  </Typography>
                  <img
                    src="/static/images/myprofile-link.jpg"
                    alt="My Profile Link"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    You would be greeted with the Profile Page.
                  </Typography>
                  <img
                    src="/static/images/profile.png"
                    alt="Profile Page"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>Click on the Edit Button.</Typography>
                  <img
                    src="/static/images/profile-edit-button.jpg"
                    alt="Profile Edit Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Change settings to Private, Public or Hidden.
                  </Typography>
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>Saves changes to your Profile.</Typography>
                  <img
                    src="/static/images/save-intro-video.jpg"
                    alt="Save Profile"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to upload a profile picture?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Click on My Profile on the Conteo`s Dashboard.
                  </Typography>
                  <img
                    src="/static/images/myprofile-link.jpg"
                    alt="My Profile Link"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    You would be greeted with the Profile Page.
                  </Typography>
                  <img
                    src="/static/images/profile.png"
                    alt="Profile Page"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>Click on the Edit Buttton.</Typography>
                  <img
                    src="/static/images/profile-edit-button.jpg"
                    alt="Profile Edit Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Click on the camera in the Profile head and then you would
                    search for the image you would like to be displayed.
                  </Typography>
                  <img
                    src="/static/images/upload-pic.jpg"
                    alt="Profile Edit Button"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    Saves changes to Profile for your Profile Picture to be
                    saved on your Profile.
                  </Typography>
                  <img
                    src="/static/images/save-intro-video.jpg"
                    alt="Profile Picture Save"
                    className={classes.images}
                  />
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                >
                  <Typography>How to accept or decline a match?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Click on the matching link on Conteo`s Dashboard.
                  </Typography>
                  <img
                    src="/static/images/matching-link.jpg"
                    alt="Matching Link"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    You would be greeted your potential matches.
                  </Typography>
                  <img
                    src="/static/images/reject-accept.png"
                    alt="Matches"
                    className={classes.images}
                  />
                </AccordionDetails>
                <AccordionDetails>
                  <Typography>
                    You can accept, decline and report any potential match.
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
