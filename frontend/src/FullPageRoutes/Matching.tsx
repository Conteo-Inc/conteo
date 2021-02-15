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
    request<Match[]>("/api/match/", "get")
      .then((resp) => {
        if (resp.parsedBody) {
          enqueue(...resp.parsedBody)
        } else {
          throw new Error("Response body is not JSON")
        }
      })
      .catch((err) => console.error(`Failed getting matches: ${err}`))
  }, [])

  const onAccept = (matchId: number) => {
    // TODO update match status on backend
    next()
  }

  const onReject = (matchId: number) => {
    // TODO update match status on backend
    next()
  }

  const onReport = (matchId: number) => {
    // TODO submit report and update match status on backend
    next()
  }

  return (
    <Container>
      {match ? (
        <>
          <Typography>{match.first_name} {match.last_name}</Typography>
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
