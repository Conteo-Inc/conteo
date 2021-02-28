import { Grid, makeStyles, Typography } from "@material-ui/core"
import {
  AccountCircle,
  ArrowDropDown,
  DraftsRounded,
  MailOutlineRounded,
} from "@material-ui/icons"
import * as React from "react"
import { Nullable } from "../../utils/context"

const useStyles = makeStyles({
  mailItem: {
    minHeight: "4rem",
    padding: "0 1rem",
  },
})

export type MailListItem = {
  // profileImage?: string //FUTUREEEEEEE
  first_name: string
  last_name: string
  viewed_at: Nullable<string>
  created_at: string
}

export default function MailItem({
  first_name,
  last_name,
  viewed_at,
  created_at,
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
      <Typography variant="h6">{created_at}</Typography>
      {viewed_at ? (
        <DraftsRounded fontSize="large" style={{ color: "#4b5e82" }} />
      ) : (
        <MailOutlineRounded fontSize="large" style={{ color: "#4b5282" }} />
      )}
      <ArrowDropDown fontSize="large" style={{ color: "#4b5e82" }} />
    </Grid>
  )
}
