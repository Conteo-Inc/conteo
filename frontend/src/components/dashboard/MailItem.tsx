import { Grid, makeStyles } from "@material-ui/core"
import * as React from "react"

const useStyles = makeStyles({
  mailItem: {
    border: "1px solid black",
    margin: "2rem",
  },
})

type Gender = "Male" | "Female" | "Other"

export type MailListItem = {
  profileImage?: string
  first_name: string
  last_name: string
  age: number
  gender: Gender
}

export default function MailItem({
  first_name,
  last_name,
  age,
  gender,
  profileImage = "profile",
}: MailListItem): JSX.Element {
  const { mailItem } = useStyles()
  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      className={mailItem}
    >
      <div>{profileImage}</div>
      <div>{first_name + last_name}</div>
      <div>{age}</div>
      <div>{gender}</div>
      <div>...</div>
    </Grid>
  )
}
