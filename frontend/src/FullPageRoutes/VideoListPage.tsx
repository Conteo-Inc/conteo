import * as React from "react"
import { request } from "../utils/fetch"

type Video = {
  id: number
  title: string
  video_file: string
}

export default function VideoListPage(): JSX.Element {
  const [videos, setVideos] = React.useState<Video[]>([])

  React.useEffect(() => {
    request<Video[]>("/api/video/", "get", false).then((res) => {
      //@TODO: Add proper checking
      setVideos(res.parsedBody ? res.parsedBody : [])
    })
  })

  return (
    <ul>
      {videos.map(({ id, title, video_file }) => {
        return (
          <li key={"video" + id}>
            {title}
            <video width={500} height={500} controls>
              <source type="video/mp4" src={video_file} />
            </video>
          </li>
        )
      })}
    </ul>
  )
}
