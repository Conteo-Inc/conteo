import { Dialog } from "@material-ui/core"
import * as React from "react"
import { Nullable } from "../../utils/context"
import { request } from "../../utils/fetch"
import Video from "./Video"

type VideoType = {
  video_file: string
  id: number
  receiver: number
}

type ViewVideoProps = {
  isOpen: boolean
  senderId: number
  handleClose: () => void
}

export default function ViewVideo({
  isOpen,
  senderId,
  handleClose,
}: ViewVideoProps): JSX.Element {
  const [video, setVideo] = React.useState<Nullable<VideoType>>(null)

  React.useEffect(() => {
    request<VideoType>({
      path: `/api/video/${senderId}/`,
      method: "get",
    }).then((video) => {
      setVideo(video.parsedBody)
    })
  }, [])

  //TODO: Replace empty fragment with loading state
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      {video ? <Video src={video.video_file} /> : <></>}
    </Dialog>
  )
}
