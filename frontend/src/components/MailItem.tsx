import * as React from "react"
import { Link } from "react-router-dom"
import {
  Grid,
  IconButton,
  makeStyles,
  Typography,
  Button,
  Avatar,
} from "@material-ui/core"
import {
  Delete,
  DraftsRounded,
  MailOutlineRounded,
  SendRounded,
} from "@material-ui/icons"
import ViewVideo from "./video/ViewVideo"
import { Nullable } from "../utils/context"
import { request } from "../utils/fetch"
import ProfileContent from "./profile/ProfileContent"
import type { ProfileContentType } from "./profile/ProfileContent"
import AbstractModal from "./AbstractModal"
import { ButtonStyle, ColorStyle } from "../utils/colors"

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
  const [
    profileContent,
    setProfileContent,
  ] = React.useState<ProfileContentType>({
    first_name: "",
    last_name: "",
    birth_date: null,
    gender: null,
    interests: [],
    image: null,
    video: null,
    id: -1,
  })
  const [showProfile, setShowProfile] = React.useState<boolean>(false)

  React.useEffect(() => {
    request<ProfileContentType>({ path: `/api/profiles/${id}/`, method: "get" })
      .then((res) => {
        const profile_content = res.parsedBody

        // Fields that are restricted on a user's profile (i.e. Private or Hidden)
        // are not returned for privacy purposes. Test if certain field were not
        // returned to avoid frontend errors related to undefined values.
        if (typeof profile_content.birth_date === "undefined") {
          profile_content.birth_date = null
        } else {
          profile_content.birth_date = new Date(
            (profile_content.birth_date as unknown) as string
          )
        }
        if (typeof profile_content.interests === "undefined") {
          profile_content.interests = []
        }

        setProfileContent(profile_content)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [id, setProfileContent])
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
      <AbstractModal
        title="Profile" //@TODO: Replace with name when available
        isModalOpen={showProfile}
        handleCancel={() => setShowProfile(false)}
        isActionable={false}
      >
        <ProfileContent readonlyContent={profileContent} />
      </AbstractModal>
      <Grid
        item
        container
        direction="row"
        xs={3}
        wrap="nowrap"
        alignItems="center"
      >
        <IconButton onClick={() => setShowProfile(true)}>
          <Avatar
            src={profileContent.image ? profileContent.image : ""}
            alt={profileContent.first_name}
          />
        </IconButton>
        <Typography variant="h6">{`${first_name} ${last_name}`}</Typography>
      </Grid>
      <Button
        variant="contained"
        style={ButtonStyle}
        onClick={() => setShowProfile(true)}
      >
        <Typography>View Profile</Typography>
      </Button>
      <Typography variant="h6">
        {created_at ? video_date.toLocaleDateString() : "No video"}
      </Typography>
      <IconButton onClick={() => setConfirmRemove(true)} disabled={!isDecided}>
        <Delete fontSize="large" style={ColorStyle} />
      </IconButton>
      <IconButton
        onClick={viewVideo}
        disabled={!created_at || paused || !isDecided}
      >
        {timeViewed ? (
          <DraftsRounded fontSize="large" style={ColorStyle} />
        ) : (
          <MailOutlineRounded fontSize="large" style={ColorStyle} />
        )}
      </IconButton>
      {/* TODO: Re-add dropdown later */}
      {/* <ArrowDropDown fontSize="large" style={{ color: "#4b5e82" }} /> */}
      <IconButton
        component={Link}
        to={`/record/${id}`}
        disabled={paused || !isDecided}
      >
        <SendRounded fontSize="large" style={ColorStyle} />
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
