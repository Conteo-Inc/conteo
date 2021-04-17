import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import * as React from "react"
import prompts from "../../utils/prompts"

type PreviewProps = {
  stream: MediaStream | null
  className: string
}
export default function Preview({
  stream,
  className,
}: PreviewProps): JSX.Element {
  const ref = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream
    }
  }, [stream])

  if (!stream) {
    return <></>
  }
  return (
    <Grid container direction="row" alignItems="center" justify="space-between">
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        xs={3}
        id="preview-left"
      >
        <Typography variant="h3">Prompts</Typography>
        {prompts.map((prompt, index) => {
          return (
            <Accordion key={`prompt-${index}`}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{`Prompt ${index + 1}: ${
                  prompt.header
                }`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{prompt.body}</Typography>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Grid>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        xs={6}
        id="preview-center"
      >
        <video ref={ref} className={className} autoPlay />
      </Grid>
      <Grid item xs={3} id="preview-right"></Grid>
    </Grid>
  )
}
