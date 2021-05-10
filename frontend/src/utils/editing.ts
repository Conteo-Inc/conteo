import * as React from "react"
import vd from "vidar"

export function onTrimConfirm(movie: vd.Movie, timeRange: number[]): void {
  /*
  Movie calculates its internal duration from the
  combined duration of all its layers.

  A layer's startTime indicates when it begins within the movie.
  There is no way to directly change the start time of the movie
  because it is always zero. So we move the video layer back to "move"
  all the other layers forward.
  */
  movie.layers[0].startTime = -1 * timeRange[0]
  movie.layers[0].duration = timeRange[1]
}

/*
Unlike other tools, the trim tool acts on the video layer itself. So undoing is a special case
*/
export function undoTrim(
  movie: vd.Movie,
  videoRef: React.MutableRefObject<HTMLVideoElement>
): void {
  movie.layers[0].startTime = 0
  movie.layers[0].duration = videoRef.current.duration
}

export function undoEdit(movie: vd.Movie): void {
  movie.layers.pop()
}

export default {}
