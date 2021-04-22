import { Box, Grid, Slider } from "@material-ui/core"
import * as React from "react"
import vd from "vidar"
import { Colors } from "../../../utils/colors"
import { Nullable } from "../../../utils/context"
import { onTrimConfirm, undoEdit, undoTrim } from "../../../utils/editing"
import { MOVIE_TIME_PRECISION } from "../../../utils/movie"
import ControlButton from "../ControlButton"
import EditControls from "./EditControls"

function itoa(i: number): string {
  return `${i}`
}

export type ActiveToolType = "trim" | "undo"
export type LimitedActiveToolType = Exclude<ActiveToolType, "undo">

type EditableVideoProps = {
  src: string
}
export default function EditableVideo({
  src,
}: EditableVideoProps): JSX.Element {
  const canvasRef = React.useRef(document.createElement("canvas"))
  const videoRef = React.useRef(document.createElement("video"))
  const progressRef = React.useRef(document.createElement("input"))
  const [movie, setMovie] = React.useState<Nullable<vd.Movie>>(null)
  const [timeRange, setTimeRange] = React.useState<number[]>([0, 0])
  const [activeTool, setActiveTool] = React.useState<Nullable<ActiveToolType>>(
    null
  )
  const editHistoryRef = React.useRef<Nullable<ActiveToolType>[]>([])

  React.useEffect(() => {
    canvasRef.current.width = 600
    canvasRef.current.height = 400

    videoRef.current.src = src
    videoRef.current.controls = true
    const movie = new vd.Movie({ canvas: canvasRef.current })
    movie.addLayer(
      new vd.layer.Video({
        startTime: 0,
        source: videoRef.current,
      })
    )

    progressRef.current.min = itoa(0)
    progressRef.current.max = itoa(movie.duration)
    progressRef.current.oninput = () => {
      movie.setCurrentTime(Number(progressRef.current.value).valueOf())
      movie.refresh()
    }
    vd.event.subscribe(movie, "movie.timeupdate", () => {
      progressRef.current.value = itoa(movie.currentTime)
    })
    setMovie(movie)
  }, [])

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <Grid item xs={3} id="edit-left">
        <EditControls
          setActiveTool={setActiveTool}
          activeTool={activeTool}
          controlRecord={{
            ["trim"]: () => {
              if (movie) {
                setTimeRange([0, movie.duration])
              }
            },
          }}
        />
      </Grid>
      <Grid
        item
        xs={6}
        id="edit-center"
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <canvas ref={canvasRef} />
        <input
          type="range"
          ref={progressRef}
          step={MOVIE_TIME_PRECISION}
          onInput={(e) => {
            console.log(e.currentTarget.value)
          }}
        />
        <Grid container direction="row" justify="center">
          <ControlButton
            type="start"
            size="large"
            onClick={() => {
              if (movie) {
                movie.play()
                progressRef.current.max = itoa(movie.duration)
              }
            }}
          />
          <ControlButton
            size="large"
            type="stop"
            onClick={() => movie?.pause()}
          />
        </Grid>
        {activeTool === "trim" && (
          <Box width={600}>
            <Slider
              defaultValue={0}
              min={0}
              max={movie?.duration}
              step={MOVIE_TIME_PRECISION}
              value={timeRange}
              onChange={(e, value) => {
                if (typeof value === "object") {
                  setTimeRange(value as number[])
                }
              }}
            />
          </Box>
        )}
      </Grid>
      <Grid item xs={3} id="edit-right">
        <ControlButton
          type="confirm"
          size="large"
          disabled={activeTool === null}
          color={activeTool === null ? Colors.GREY : Colors.DEEP_RED}
          onClick={() => {
            if (movie) {
              if (activeTool === "trim") {
                onTrimConfirm(movie, timeRange)
                editHistoryRef.current.push(activeTool)
              } else if (activeTool === "undo") {
                if (
                  editHistoryRef.current[editHistoryRef.current.length - 1] ===
                  "trim"
                ) {
                  undoTrim(movie, videoRef)
                } else {
                  undoEdit(movie)
                }
              }
              setActiveTool(null)
            }
          }}
        />
        <ControlButton
          type="cancel"
          size="large"
          disabled={activeTool === null}
          color={activeTool === null ? Colors.GREY : Colors.DEEP_RED}
          onClick={() => setActiveTool(null)}
        />
      </Grid>
    </Grid>
  )
}
