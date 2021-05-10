import * as React from "react"
import { useReactMediaRecorder } from "react-media-recorder"
import { Grid, makeStyles } from "@material-ui/core"
import Controls from "../components/video/Controls"
import { parseIdentity, request } from "../utils/fetch"
import { useHistory, useParams } from "react-router-dom"
import { Nullable, NullableId } from "../utils/context"
import ConfirmationModal from "../components/AbstractModal"
import { History } from "history"
import EditableVideo from "../components/video/editing/EditableVideo"
import Preview from "../components/video/Preview"
import vd from "vidar"

const useStyles = makeStyles({
  video_root: {
    backgroundColor: "black",
  },
})

function sendVideo(
  movie: Nullable<vd.Movie>,
  receiver: NullableId,
  history: History
): void {
  if (movie) {
    movie
      .record({
        frameRate: 60,
      })
      .then((blob) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = () => {
          request({
            path: "/api/videos/",
            method: "post",
            body: {
              receiver: receiver,
              data: reader.result,
            },
            parser: parseIdentity,
          }).then(() => history.goBack())
        }
      })
  }
}

export default function RecordPage(): JSX.Element {
  const { receiver } = useParams<{ receiver: string }>()
  const history = useHistory()
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)
  const [movie, setMovie] = React.useState<Nullable<vd.Movie>>(null)

  const classes = useStyles()

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
  } = useReactMediaRecorder({
    video: true,
  })

  const handleConfirm = () => {
    setIsModalOpen(false)
    sendVideo(movie, Number(receiver), history)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <Grid container direction="column" wrap="nowrap" alignItems="center">
      {mediaBlobUrl ? (
        <EditableVideo src={mediaBlobUrl} movie={movie} setMovie={setMovie} />
      ) : (
        <Preview stream={previewStream} className={classes.video_root} />
      )}
      <Controls
        status={status}
        startRecording={startRecording}
        stopRecording={stopRecording}
        sendVideo={() => {
          setIsModalOpen(true)
        }}
      />
      <ConfirmationModal
        title={"Confirm"}
        description={"Would you like to send your video?"}
        confirmText={"Send"}
        cancelText={"Cancel"}
        isModalOpen={isModalOpen}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />
    </Grid>
  )
}
