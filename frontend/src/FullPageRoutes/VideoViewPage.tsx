import * as React from "react"
import useFocusedUser from "../utils/context"
import { request } from "../utils/fetch"
import Video from "../components/video/Video"
import { Dialog } from "@material-ui/core"

type VideoType = {
  video_file: string
  id: number
  receiver: number
}

export default function VideoViewPage(): JSX.Element {
  // In this case, focusedUser will be the one whose video I am viewing
  const [focusedUser] = useFocusedUser()
  const [video, setVideo] = React.useState<VideoType>({
    id: 0,
    receiver: 0,
    video_file: "",
  })

  React.useEffect(() => {
    request<VideoType>({
      path: `/api/video/${focusedUser}/`,
      method: "get",
    }).then((video) => {
      setVideo(video.parsedBody)
    })
  }, [])

  return (
    <Dialog open>
      <Video src={video.video_file} />
    </Dialog>
  )
}
