import * as React from "react"
import {
  Typography,
  Button,
  Grid,
  makeStyles,
  Avatar,
  IconButton,
} from "@material-ui/core"
import { Check, Block, Flag, PlayCircleFilled } from "@material-ui/icons"
import { request } from "../utils/fetch"
import ViewVideo from "../components/video/ViewVideo"

const useStyles = makeStyles({
  root: {
    height: "100%",
    backgroundColor: "#ede8db",
  },
  card: {
    marginTop: 25,
    border: "1px solid grey",
    minHeight: "25rem",
  },
  button: {
    margin: "10px 20px",
  },
})

type MatchControlsType = {
  matchId: number
  onAccept: (matchId: number) => void
  onReject: (matchId: number) => void
  onReport: (matchId: number) => void
}

type MatchControlButton = {
  title: string
  color: "primary" | "secondary" | "default"
  onClick: (matchId: number) => void
  icon: JSX.Element
}

function MatchControls({
  matchId,
  onAccept,
  onReject,
  onReport,
}: MatchControlsType): JSX.Element {
  const classes = useStyles()

  const controls: MatchControlButton[] = [
    {
      title: "Accept",
      color: "primary",
      onClick: onAccept,
      icon: <Check />,
    },
    {
      title: "Reject",
      color: "default",
      onClick: onReject,
      icon: <Block />,
    },
    {
      title: "Report",
      color: "secondary",
      onClick: onReport,
      icon: <Flag />,
    },
  ]

  return (
    <Grid item container direction="row" justify="center" alignItems="center">
      {controls.map(({ title, color, onClick, icon }: MatchControlButton) => (
        <Button
          key={`matchControlButton-${title}`}
          variant="contained"
          color={color}
          className={classes.button}
          onClick={() => onClick(matchId)}
        >
          {icon}
          {title}
        </Button>
      ))}
    </Grid>
  )
}

type Match = {
  id: number
  first_name: string
  last_name: string
  gender: string
  birth_date: string
  email: string
  phone_number: string
  interests: string
  has_intro: boolean
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
  const [introVisible, setVisible] = React.useState<boolean>(false)
  const classes = useStyles()

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
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.root}
    >
      {match ? (
        <Grid item>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
            className={classes.card}
          >
            <Grid
              item
              container
              justify="center"
              alignItems="center"
              direction="column"
            >
              <Typography>{`${match.first_name} ${match.last_name}`}</Typography>
              <Avatar />
            </Grid>
            <Grid item container direction="row" justify="space-around">
              {/* TODO: Replace with forEach and don't include empty */}
              <Typography>{`Gender: ${match.gender}`}</Typography>
              <Typography>{`Birthday: ${match.birth_date}`}</Typography>
              <Typography>{`Email: ${match.email}`}</Typography>
            </Grid>
            <Grid item container direction="row" justify="center">
              <Typography>{`Interests: ${match.interests}`}</Typography>
            </Grid>
            <Grid item>
              {match.has_intro ? (
                <>
                  <IconButton onClick={() => setVisible(true)}>
                    <PlayCircleFilled fontSize="large" />
                  </IconButton>
                  <ViewVideo
                    isOpen={introVisible}
                    senderId={match.id}
                    handleClose={() => setVisible(false)}
                    intro
                  />
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>

          <Grid item container justify="center" alignItems="center">
            <MatchControls
              matchId={match.id}
              onAccept={onAccept}
              onReject={onReject}
              onReport={onReport}
            />
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  )
}
