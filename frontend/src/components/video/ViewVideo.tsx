import * as React from "react"
import { request } from "../../utils/fetch"
import Video from "../../components/video/Video"
import { Dialog } from "@material-ui/core"
import { SetStateDispatch } from "../../utils/context"

type VideoType = {
  video_file: string
  id: number
  receiver: number
}

type ViewVideoType = {
  isOpen: boolean
  senderId: number
  setisOpen: SetStateDispatch<boolean>
  handleClose: any
}

export default function ViewVideo(props: ViewVideoType): JSX.Element {
  const [video, setVideo] = React.useState<VideoType>({
    id: 0,
    receiver: 0,
    video_file: "",
  })

  React.useEffect(() => {
    request<VideoType>({
      path: `/api/video/${props.senderId}/`,
      method: "get",
    }).then((video) => {
      setVideo(video.parsedBody)
    })
  }, [])

  return (
    <Dialog open={props.isOpen} onClose={props.handleClose}>
      <Video src={video.video_file} />
    </Dialog>
  )
}
