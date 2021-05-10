import * as React from "react"
import { Link } from "react-router-dom"
import { Grid, IconButton, makeStyles, Typography } from "@material-ui/core"
import {
  AccountCircle,
  Delete,
  DraftsRounded,
  MailOutlineRounded,
  SendRounded,
} from "@material-ui/icons"
import ViewVideo from "./video/ViewVideo"
import { Nullable } from "../utils/context"
import { request } from "../utils/fetch"
import AbstractModal from "./AbstractModal"

const useStyles = makeStyles({
  mailItem: {
    minHeight: "4rem",
    padding: "0 1rem",
    marginBottom: "5px",
  },
  undecidedMatch: {
    backgroundColor: "lightgrey",
    borderRadius: "10px",
  },
})

export type MailListItem = {
  // profileImage?: string //FUTUREEEEEEE
  first_name: string
  last_name: string
  viewed_at: Nullable<string>
  created_at: string
  id: number
  paused: boolean
  removePenpal: (id: number) => void
  video_id: number
  isDecided: boolean
}

export default function MailItem({
  first_name,
  last_name,
  viewed_at,
  created_at,
  id,
  paused,
  removePenpal,
  video_id,
  isDecided,
}: MailListItem): JSX.Element {
  const { mailItem, undecidedMatch } = useStyles()
  const [visible, setVisible] = React.useState<boolean>(false)
  const [showConfirmRemove, setConfirmRemove] = React.useState<boolean>(false)
  const video_date = new Date(created_at)
  const [timeViewed, setTimeViewed] = React.useState<Nullable<string>>(
    viewed_at
  )

  const onConfirmRemove = () => {
    setConfirmRemove(false)
    removePenpal(id)
  }

  const onCancelRemove = () => {
    setConfirmRemove(false)
  }

  const viewVideo = () => {
    setVisible(true)

    // Test if video has not already been viewed.
    if (timeViewed === null) {
      // Update video viewed_at field.
      request<{ viewed_at: Nullable<string> }>({
        path: `/api/mailviewed/${video_id}/`,
        method: "put",
      })
        .then((res) => {
          setTimeViewed(res.parsedBody.viewed_at)
        })
        .catch((err) => console.error(err))
    }
  }

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={`${mailItem} ${!isDecided && undecidedMatch}`}
    >
      <AbstractModal
        title="Remove penpal"
        description={`Are you sure you want to remove ${first_name} ${last_name}?`}
        isModalOpen={showConfirmRemove}
        handleConfirm={onConfirmRemove}
        handleCancel={onCancelRemove}
      />
      <Grid item container direction="row" xs={3} wrap="nowrap">
        <AccountCircle fontSize="large" style={{ color: "#4b5e82" }} />
        <Typography variant="h6">{`${first_name} ${last_name}`}</Typography>
      </Grid>
      <Typography variant="h6">
        {created_at ? video_date.toLocaleDateString() : "No video"}
      </Typography>
      <IconButton onClick={() => setConfirmRemove(true)} disabled={!isDecided}>
        <Delete fontSize="large" style={{ color: "#4b5282" }} />
      </IconButton>
      <IconButton onClick={viewVideo} disabled={!created_at || paused || !isDecided}>
        {timeViewed ? (
          <DraftsRounded fontSize="large" style={{ color: "#4b5e82" }} />
        ) : (
          <MailOutlineRounded fontSize="large" style={{ color: "#4b5282" }} />
        )}
      </IconButton>
      {/* TODO: Re-add dropdown later */}
      {/* <ArrowDropDown fontSize="large" style={{ color: "#4b5e82" }} /> */}
      <IconButton
        component={Link}
        to={`/record/${id}`}
        disabled={paused || !isDecided}
      >
        <SendRounded fontSize="large" style={{ color: "#4b5282" }} />
      </IconButton>
      {created_at && (
        <ViewVideo
          isOpen={visible}
          senderId={id}
          handleClose={() => setVisible(false)}
        />
      )}
    </Grid>
  )
}
