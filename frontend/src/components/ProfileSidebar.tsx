import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Avatar, Typography } from "@material-ui/core"
import PersonIcon from "@material-ui/icons/Person"
import NotificationsIcon from "@material-ui/icons/Notifications"
import SettingsIcon from "@material-ui/icons/Settings"
import MailIcon from "@material-ui/icons/Mail"
import LockIcon from "@material-ui/icons/Lock"

// ProfileSidebar props.
type ProfileSidebarProps = {
  name: string
  profileImg: string
}

// Aitem listed in the sidebar.
type SidebarItem = {
  icon: JSX.Element
  title: string
}

const useStyles = makeStyles({
  tab: {
    padding: 15,
    borderBottom: "2px solid black",
    cursor: "pointer",
  },
  headerAvatar: {
    height: 60,
    width: 60,
  },
  headerName: {
    fontSize: "2rem",
    padding: "32px 0px",
  },
  tabTitle: {
    fontSize: "1rem",
    "@media (min-width:1100px)": {
      fontSize: "1.5rem",
    },
    fontWeight: "bold",
    cursor: "pointer",
  },
})

export default function ProfileSidebar(props: ProfileSidebarProps) {
  const classes = useStyles()

  // Add sidebar items to list.
  var items: SidebarItem[] = [
    {
      icon: <PersonIcon />,
      title: "Bio",
    },
    {
      icon: <NotificationsIcon />,
      title: "Notifications",
    },
    {
      icon: <SettingsIcon />,
      title: "Settings",
    },
    {
      icon: <MailIcon />,
      title: "Contact Us",
    },
    {
      icon: <LockIcon />,
      title: "Privacy",
    },
  ]

  return (
    <>
      <Grid container item className={classes.tab} xs={12}>
        <Grid container item alignItems="center" justify="center" xs={3}>
          <Avatar
            alt={props.name}
            src={props.profileImg}
            className={classes.headerAvatar}
          />
        </Grid>
        <Grid container item alignItems="center" xs={9}>
          <Typography className={`${classes.headerName} ${classes.tabTitle}`}>
            {props.name}
          </Typography>
        </Grid>
      </Grid>
      {items.map(({ icon, title }: SidebarItem) => (
        <Grid key={title} container item className={classes.tab} xs={12}>
          <Grid container item alignItems="center" justify="center" xs={3}>
            {icon}
          </Grid>
          <Grid container item alignItems="center" xs={9}>
            <Typography className={classes.tabTitle}>{title}</Typography>
          </Grid>
        </Grid>
      ))}
    </>
  )
}
