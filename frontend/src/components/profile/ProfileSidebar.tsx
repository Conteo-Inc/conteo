import * as React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Avatar, Typography, Link } from "@material-ui/core"
import PersonIcon from "@material-ui/icons/Person"
import NotificationsIcon from "@material-ui/icons/Notifications"
import SettingsIcon from "@material-ui/icons/Settings"
import MailIcon from "@material-ui/icons/Mail"
import LockIcon from "@material-ui/icons/Lock"
import { Nullable } from "../../utils/context"
import type { ProfileComponentSetters } from "../../utils/profile"

// ProfileSidebar props.
type ProfileSidebarProps = {
  firstName: string
  lastName: string
  image: Nullable<string>
  componentStateSetters: ProfileComponentSetters
}

// Aitem listed in the sidebar.
type SidebarItem = {
  icon: JSX.Element
  title: string
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

const useStyles = makeStyles({
  tab: {
    padding: 15,
    borderBottom: "2px solid black",
  },
  headerAvatar: {
    height: 60,
    width: 60,
  },
  headerName: {
    fontSize: "2rem",
  },
  tabTitle: {
    fontSize: "1rem",
    "@media (min-width:1100px)": {
      fontSize: "1.5rem",
    },
    fontWeight: "bold",
  },
  componentLink: {
    height: "100%",
    width: "100%",
    display: "block",
    borderRadius: "2px",
    cursor: "pointer",
    transition: "0.5s",
    "&:hover": {
      backgroundColor: "lightgrey",
    },
  },
})

export default function ProfileSidebar({
  firstName,
  lastName,
  image,
  componentStateSetters,
}: ProfileSidebarProps): JSX.Element {
  const classes = useStyles()

  // Add sidebar items to list.
  const items: SidebarItem[] = [
    {
      icon: <PersonIcon />,
      title: "Profile",
      setIsActive: componentStateSetters.setIsProfileActive,
    },
    {
      icon: <LockIcon />,
      title: "Privacy",
      setIsActive: componentStateSetters.setIsPrivacyActive,
    },
    {
      icon: <NotificationsIcon />,
      title: "Notifications",
      setIsActive: componentStateSetters.setIsNotificationsActive,
    },
    {
      icon: <SettingsIcon />,
      title: "Settings",
      setIsActive: componentStateSetters.setIsSettingsActive,
    },
    {
      icon: <MailIcon />,
      title: "Contact Us",
      setIsActive: componentStateSetters.setIsContactUsActive,
    },
  ]

  // When another component is selected, update the active state of the current
  // component and the active state of the selected component.
  const handleItemSelected = (
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    Object.values(componentStateSetters).map((setter) => setter(false))
    setIsActive(true)
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Grid container className={classes.tab} alignItems="center">
            <Grid item xs={3}>
              <Avatar
                src={image ? image : ""}
                className={classes.headerAvatar}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography
                className={`${classes.headerName} ${classes.tabTitle}`}
              >
                {firstName} {lastName}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {items.map(({ icon, title, setIsActive }: SidebarItem) => (
          <Grid key={title} item xs={12}>
            <Grid container className={classes.tab}>
              <Link
                className={classes.componentLink}
                onClick={() => handleItemSelected(setIsActive)}
                color="inherit"
              >
                <Grid container alignItems="center" justify="flex-end">
                  <Grid item xs={2}>
                    {icon}
                  </Grid>
                  <Grid item xs={9}>
                    <Typography className={classes.tabTitle}>
                      {title}
                    </Typography>
                  </Grid>
                </Grid>
              </Link>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
