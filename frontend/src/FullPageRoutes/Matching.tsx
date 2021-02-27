import * as React from "react"
import { Typography, Button, Container } from "@material-ui/core"
import { Check, Block, Flag } from "@material-ui/icons"
import { request } from "../utils/fetch"

type Match = {
  id: number
  first_name: string
  last_name: string
}

function useQueue<T>(): [T, () => void, (...newItems: T[]) => void] {
  const [items, setItems] = React.useState<T[]>([])
  const enqueueItems = (...newItems: T[]) => {
    setItems((items) => items.concat(newItems))
  }
  const nextItem = () => {
    setItems((items) => items.slice(1))
  }
  return [items[0], nextItem, enqueueItems]
}

export default function MatchingPage(): JSX.Element {
  const [match, next, enqueue] = useQueue<Match>()

  React.useEffect(() => {
    // TODO request more matches when match queue gets low
    request<Match[]>({ path: "/api/matches/", method: "get" })
      .then((resp) => {
        enqueue(...resp.parsedBody)
      })
      .catch((err) => console.error(`Failed to get matches: ${err}`))
  }, [])

  const onAccept = (matchId: number) => {
    request({
      path: "/api/matches/",
      method: "put",
      body: { matchId, response: true },
    }).catch((err) => console.error(`Failed to update match status: ${err}`))
    next()
  }

  const onReject = (matchId: number) => {
    request({
      path: "/api/matches/",
      method: "put",
      body: { matchId, response: false },
    }).catch((err) => console.error(`Failed to update match status: ${err}`))
    next()
  }

  const onReport = (matchId: number) => {
    request({
      path: "/api/matches/",
      method: "put",
      body: { matchId, response: false },
    }).catch((err) => console.error(`Failed to update match status: ${err}`))
    request({
      path: "/api/reports/",
      method: "post",
      body: { report_type: "P", reportee: matchId },
    }).catch((err) => console.error(`Failed to report match: ${err}`))
    next()
  }

  return (
    <Container>
      {match ? (
        <>
          <Typography>
            {match.first_name} {match.last_name}
          </Typography>
          <Button onClick={() => onAccept(match.id)}>
            <Check />
            Accept
          </Button>
          <Button onClick={() => onReject(match.id)}>
            <Block />
            Reject
          </Button>
          <Button onClick={() => onReport(match.id)}>
            <Flag />
            Report
          </Button>
        </>
      ) : (
        <></>
      )}
    </Container>
  )
}
