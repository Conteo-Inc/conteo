import * as React from "react"
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import { Link } from "react-router-dom"
import HomeIcon from "@material-ui/icons/Home"
import Person from "@material-ui/icons/Person"
import Info from "@material-ui/icons/Info"
import Help from "@material-ui/icons/Help"
import MailList from "../components/dashboard/MailList"

const useStyles = makeStyles({
  dashboard: {
    textAlign: "center",
    logo: {
      height: "40vmin",
      pointerEvents: "none",
    },
  },
  drawPaper: {
    width: "inherit",
  },
  link: {
    color: "#410000",
  },

  dashboardRoot: {
    height: "100%",
    backgroundColor: "#ede8db",
  },
  drawer: {
    borderRight: "1px solid white",
  },
  mail: {},
})

function Drawer(): JSX.Element {
  const classes = useStyles()
  return (
    <>
      <List>
        <Link to="/" className={classes.link}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
      </List>
      <Link to="/profile" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary={"My Profile"} />
        </ListItem>
      </Link>
      <Link to="/faqs" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary={"FAQs"} />
        </ListItem>
      </Link>
      <Link to="/help" className={classes.link}>
        <ListItem button>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText primary={"Tutorials"} />
        </ListItem>
      </Link>
    </>
  )
}

export default function Dashboard(): JSX.Element {
  const { dashboardRoot, drawer, mail } = useStyles()
  return (
    <Grid
      id="dashboard-root"
      className={dashboardRoot}
      direction="row"
      container
    >
      <Grid id="drawer" className={drawer} item md={2}>
        <Drawer />
      </Grid>
      <Grid id="mail" item sm={10} className={mail}>
        <MailList />
      </Grid>
    </Grid>
  )
}
