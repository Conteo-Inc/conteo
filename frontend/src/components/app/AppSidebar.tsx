import * as React from "react"
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import { Link } from "react-router-dom"
import HomeIcon from "@material-ui/icons/Home"
import Person from "@material-ui/icons/Person"
import People from "@material-ui/icons/People"
import Info from "@material-ui/icons/Info"
import Help from "@material-ui/icons/Help"

const useStyles = makeStyles({
  link: {
    color: "#410000",
  },
})

type SidebarLink = {
  title: string
  link: string
  iconJsx: JSX.Element
}

const links: SidebarLink[] = [
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
    title: "Matching",
    link: "/matches",
    iconJsx: <People />,
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

export default function AppSidebar(): JSX.Element {
  const classes = useStyles()
  return (
    <List id="appsidebarlist">
      {links.map(({ title, link, iconJsx }: SidebarLink, index: number) => (
        <Link key={`sidebarLink-${index}`} to={link} className={classes.link}>
          <ListItem button>
            <ListItemIcon>{iconJsx}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        </Link>
      ))}
    </List>
  )
}
