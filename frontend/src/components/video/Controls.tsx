import { Grid, makeStyles } from "@material-ui/core"
import * as React from "react"
import { StatusMessages } from "react-media-recorder"
import { Colors } from "../../utils/colors"
import ControlButton from "./ControlButton"

const useStyles = makeStyles({
  controls: {
    height: 100,
  },
})

type ControlsProps = {
  status: StatusMessages
  startRecording: () => void
  stopRecording: () => void
  sendVideo: () => void
}

export default function Controls({
  status,
  startRecording,
  stopRecording,
  sendVideo,
}: ControlsProps): JSX.Element {
  const { controls } = useStyles()
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      className={controls}
    >
      <Grid item>
        {status === "idle" ? (
          <ControlButton
            ariaLabel="record"
            color={Colors.DEEP_RED}
            onClick={startRecording}
            size="large"
            type="start"
          />
        ) : status === "recording" ? (
          <ControlButton
            ariaLabel="stop"
            color={Colors.DEEP_RED}
            onClick={stopRecording}
            size="large"
            type="stop"
          />
        ) : status === "stopped" ? (
          <ControlButton
            ariaLabel="send"
            color={Colors.DEEP_RED}
            onClick={sendVideo}
            size="large"
            type="send"
          />
        ) : (
          <ControlButton
            ariaLabel="loading"
            color={Colors.DEEP_RED}
            size="large"
            type="loading"
            disabled
          />
        )}
      </Grid>
    </Grid>
  )
}
