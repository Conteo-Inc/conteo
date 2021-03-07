import * as React from "react"
import { request } from "../utils/fetch"
import { useHistory, useParams } from "react-router-dom"
import Video from "../components/video/Video"
import {
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Button,
} from "@material-ui/core"

type VideoType = {
  video_file: string
  id: number
  receiver: number
}

export default function VideoViewPage(): JSX.Element {
  // In this case, focusedUser will be the one whose video I am viewing
  const { sender } = useParams<{ sender: string }>()
  const history = useHistory()
  const [video, setVideo] = React.useState<VideoType>({
    id: 0,
    receiver: 0,
    video_file: "",
  })

  React.useEffect(() => {
    request<VideoType>({
      path: `/api/video/${sender}/`,
      method: "get",
    }).then((video) => {
      setVideo(video.parsedBody)
    })
  }, [])

  return (
    <Dialog open>
      <DialogContent>
        <Video src={video.video_file} />
      </DialogContent>
      <DialogActions>
        <Grid container direction="row" justify="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.goBack()}
          >
            <Typography variant="h6">Back</Typography>
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
