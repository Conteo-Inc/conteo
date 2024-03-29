import * as React from "react"
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core"
import { Link } from "react-router-dom"
import {
  Home,
  Person,
  People,
  Info,
  Help,
  Settings,
  Lock,
} from "@material-ui/icons"

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
    iconJsx: <Home />,
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
    title: "Privacy",
    link: "/privacy",
    iconJsx: <Lock />,
  },
  {
    title: "Account",
    link: "/accounts",
    iconJsx: <Settings />,
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
  {
    title: "Contact Us",
    link: "/contact",
    iconJsx: <Info />,
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
