import * as React from "react"
import {
  Typography,
  Button,
  Grid,
  makeStyles,
  Avatar,
  IconButton,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core"
import { Check, Block, Flag, PlayCircleFilled } from "@material-ui/icons"
import { request, queryParams } from "../utils/fetch"
import ViewVideo from "../components/video/ViewVideo"

type EnqueueFunc<T> = (...newItems: T[]) => void

type MatchControlsType = {
  matchId: number
  onAccept: (matchId: number) => void
  onReject: (matchId: number) => void
  onReport: (matchId: number) => void
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

enum Gender {
  MALE = "M",
  FEMALE = "F",
  OTHER = "O",
}

const ageLimits = { min: 18, max: 130 }
const initFilters = {
  minAge: ageLimits.min,
  maxAge: ageLimits.max,
  genders: Object.values(Gender),
}

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  card: {
    border: "1px solid blue",
    minHeight: "25rem",
  },
})

function MatchControls({
  matchId,
  onAccept,
  onReject,
  onReport,
}: MatchControlsType): JSX.Element {
  return (
    <Grid item container direction="row" justify="space-around">
      <Button onClick={() => onAccept(matchId)}>
        <Check />
        Accept
      </Button>
      <Button onClick={() => onReject(matchId)}>
        <Block />
        Reject
      </Button>
      <Button onClick={() => onReport(matchId)}>
        <Flag />
        Report
      </Button>
    </Grid>
  )
}

function MatchingFilters({
  filters,
  dispatch,
}: {
  filters: typeof initFilters
  dispatch: React.Dispatch<Partial<typeof initFilters>>
}): JSX.Element {
  return (
    <Grid container justify={"center"} spacing={2}>
      <Grid item>
        <TextField
          type="number"
          helperText="Min age"
          inputProps={ageLimits}
          value={filters.minAge}
          onChange={(e) => {
            dispatch({ minAge: parseInt(e.currentTarget.value) })
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          type="number"
          helperText="Max age"
          inputProps={ageLimits}
          value={filters.maxAge}
          onChange={(e) =>
            dispatch({ maxAge: parseInt(e.currentTarget.value) })
          }
        />
      </Grid>
      <Grid item>
        <Select
          multiple
          value={filters.genders}
          onChange={(e) => {
            dispatch({ genders: e.target.value as Gender[] })
          }}
        >
          <MenuItem value={Gender.MALE}>Male</MenuItem>
          <MenuItem value={Gender.FEMALE}>Female</MenuItem>
          <MenuItem value={Gender.OTHER}>Other</MenuItem>
        </Select>
      </Grid>
    </Grid>
  )
}

function useQueue<T>(): [T, () => void, EnqueueFunc<T>, () => void] {
  const [items, setItems] = React.useState<T[]>([])
  const enqueueItems = (...newItems: T[]) => {
    setItems((items) => items.concat(newItems))
  }
  const nextItem = () => {
    setItems((items) => items.slice(1))
  }
  const clear = () => {
    setItems([])
  }
  return [items[0], nextItem, enqueueItems, clear]
}

export default function MatchingPage(): JSX.Element {
  const [match, next, enqueue, clearQ] = useQueue<Match>()
  const [filters, dispatch] = React.useReducer(
    (state: typeof initFilters, action: Partial<typeof initFilters>) => {
      clearQ()
      return { ...state, ...action }
    },
    initFilters
  )
  const [introVisible, setVisible] = React.useState<boolean>(false)
  const classes = useStyles()

  React.useEffect(() => {
    // TODO request more matches when match queue gets low
    request<Match[]>({
      path: "/api/matches/" + queryParams(filters),
      method: "get",
    })
      .then((resp) => {
        enqueue(...resp.parsedBody)
      })
      .catch((err) => console.error(`Failed to get matches: ${err}`))
  }, [filters])

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
      <MatchingFilters filters={filters} dispatch={dispatch} />
      {match ? (
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
          item
          xs={4}
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
          <MatchControls
            matchId={match.id}
            onAccept={onAccept}
            onReject={onReject}
            onReport={onReport}
          />
        </Grid>
      ) : (
        <Typography>You have no matches</Typography>
      )}
    </Grid>
  )
}
