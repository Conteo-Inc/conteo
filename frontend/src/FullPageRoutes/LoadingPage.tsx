import { Box } from "@material-ui/core"
import { LoopRounded } from "@material-ui/icons"
import * as React from "react"

export default function LoadingPage(): JSX.Element {
  return (
    <Box>
      <LoopRounded fontSize="large" />
    </Box>
  )
}
