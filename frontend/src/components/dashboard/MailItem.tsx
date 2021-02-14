import { Grid, makeStyles, Typography } from "@material-ui/core"
import { AccountCircle, ArrowDropDown } from "@material-ui/icons"
import * as React from "react"

const useStyles = makeStyles({
  mailItem: {
    minHeight: "4rem",
    padding: "0 1rem",
  },
})

type Gender = "Male" | "Female" | "Other"

export type MailListItem = {
  profileImage?: string
  first_name: string
  last_name: string
  birth_date: number
  gender: Gender
}

export default function MailItem({
  first_name,
  last_name,
  birth_date,
  gender,
}: MailListItem): JSX.Element {
  const { mailItem } = useStyles()
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      className={mailItem}
    >
      <Grid item container direction="row" xs={3} wrap="nowrap">
        <AccountCircle fontSize="large" style={{ color: "#4b5e82" }} />
        <Typography variant="h6">{`${first_name} ${last_name}`}</Typography>
      </Grid>
      <Typography variant="h6">{birth_date}</Typography>
      <Typography variant="h6">{gender}</Typography>
      <ArrowDropDown fontSize="large" style={{ color: "#4b5e82" }} />
    </Grid>
  )
}
