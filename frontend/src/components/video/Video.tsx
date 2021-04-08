import * as React from "react"

type VideoProps = {
  src: string
  className?: string
}
export default function Video({ src, className }: VideoProps): JSX.Element {
  return <video controls src={src} className={className} />
}
