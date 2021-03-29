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

type DrawerLink = {
  title: string
  link: string
  iconJsx: JSX.Element
}

const drawerLinks: DrawerLink[] = [
  {
    title: "Home",
    link: "/",
    iconJsx: <HomeIcon />,
  },
  {
    title: "My Profile",
    link: "/profile",
    iconJsx: <Person />,
  },
  {
    title: "FAQs",
    link: "/faqs",
    iconJsx: <Info />,
  },
  {
    title: "Tutorials",
    link: "/help",
    iconJsx: <Help />,
  },
]

function Drawer(): JSX.Element {
  const classes = useStyles()

  return (
    <List>
      {drawerLinks.map(
        ({ title, link, iconJsx }: DrawerLink, index: number) => (
          <Link key={`drawerLink-${index}`} to={link} className={classes.link}>
            <ListItem button>
              <ListItemIcon>{iconJsx}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </Link>
        )
      )}
    </List>
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
