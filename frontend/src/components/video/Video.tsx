import * as React from "react"

type VideoProps = {
  src: string
}
export default function Video({ src }: VideoProps): JSX.Element {
  return <video controls src={src} />
}
