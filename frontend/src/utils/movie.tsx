import vd from "vidar"

export function addVisual(
  movie: vd.Movie,
  options: vd.layer.VisualOptions
): void {
  movie.addLayer(new vd.layer.Visual(options))
}

export function popLayer(movie: vd.Movie): void {
  movie.layers.pop()
}

//Ripped from vidar
type RecordOptions = {
  frameRate: number
  duration?: number
  type?: string
  video?: boolean
  audio?: boolean
  mediaRecorderOptions?: Record<string, unknown>
}
export function recordMovie(movie: vd.Movie, options: RecordOptions): void {
  movie.record(options).then((blob: Blob) => {
    console.log(blob)
  })
}

export default {}
