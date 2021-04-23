import * as React from "react"
import { useReactMediaRecorder } from "react-media-recorder"
import { Grid, makeStyles } from "@material-ui/core"
import Controls from "../components/video/Controls"
import { parseIdentity, request } from "../utils/fetch"
import { useHistory, useParams } from "react-router-dom"
import { Nullable, NullableId } from "../utils/context"
import ConfirmationModal from "../components/AbstractModal"
import Video from "../components/video/Video"
import { History } from "history"

const useStyles = makeStyles({
  video_root: {
    backgroundColor: "black",
  },
})

type PreviewProps = {
  stream: MediaStream | null
}
function Preview({ stream }: PreviewProps) {
  const ref = React.useRef<HTMLVideoElement>(null)
  const classes = useStyles()

  React.useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
    }
  }, [stream])

  if (!stream) {
    return null
  }
  return <video ref={ref} className={classes.video_root} autoPlay />
}

function sendVideo(
  blob: Nullable<Blob>,
  receiver: NullableId,
  history: History
) {
  if (blob) {
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
  }
}

export default function RecordPage(): JSX.Element {
  const [videoBlob, setVideoBlob] = React.useState<Nullable<Blob>>(null)
  const { receiver } = useParams<{ receiver: string }>()
  const history = useHistory()
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
  } = useReactMediaRecorder({
    video: true,
    onStop: (_, blob) => setVideoBlob(blob),
  })

  const handleConfirm = () => {
    setIsModalOpen(false)
    sendVideo(videoBlob, Number(receiver), history)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const classes = useStyles()
  return (
    <Grid container direction="column" wrap="nowrap" alignItems="center">
      <Grid item xs={6}>
        {mediaBlobUrl ? (
          <Video src={mediaBlobUrl} className={classes.video_root} />
        ) : (
          <Preview stream={previewStream} />
        )}
      </Grid>
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
