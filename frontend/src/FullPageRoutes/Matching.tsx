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
  Chip,
  Checkbox,
  FormControlLabel,
  InputLabel,
  FormControl,
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
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
  interests: Interest[]
  has_intro: boolean
}

type InterestID = number

type Interest = {
  id: InterestID
  category: string
  title: string
}

enum Gender {
  MALE = "M",
  FEMALE = "F",
  OTHER = "O",
}

class FilterState {
  static readonly ageLimits = { min: 18, max: 130 }
  readonly minAge?: number
  readonly maxAge?: number
  readonly genders?: Gender[] = []
  readonly interests?: Interest[] = []
}

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  card: {
    border: "1px solid blue",
    minHeight: "25rem",
  },
  filters: {
    width: "max-content",
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
  filters: FilterState
  dispatch: React.Dispatch<Partial<FilterState>>
}): JSX.Element {
  const classes = useStyles()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [interestOptions, setInterestOptions] = React.useState<Interest[]>([])
  const [interestInputValue, setInterestInputValue] = React.useState<string>("")

  React.useEffect(() => {
    request<Interest[]>({ path: "/api/interests/", method: "get" })
      .then((res) => {
        setLoading(false)
        setInterestOptions(
          res.parsedBody
            .sort((a, b) => a.title.localeCompare(b.title))
            .sort((a, b) => a.category.localeCompare(b.category))
        )
      })
      .catch((err) => console.log(`Failed to load interests: ${err}`))
  }, [])

  return (
    <Grid container className={classes.filters} spacing={2}>
      <Grid container item direction="column" xs>
        <Grid item>
          <TextField
            type="number"
            label="Min age"
            disabled={!filters.minAge}
            inputProps={FilterState.ageLimits}
            value={filters.minAge ?? FilterState.ageLimits.min}
            onChange={(e) => {
              dispatch({ minAge: parseInt(e.target.value) })
            }}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={!filters.minAge}
                onChange={(ev) => {
                  dispatch({
                    minAge: ev.target.checked
                      ? undefined
                      : FilterState.ageLimits.min,
                  })
                }}
              />
            }
            label="Ignore min age"
          />
        </Grid>
      </Grid>
      <Grid container item direction="column" xs>
        <Grid item>
          <TextField
            type="number"
            label="Max age"
            disabled={!filters.maxAge}
            inputProps={FilterState.ageLimits}
            value={filters.maxAge ?? FilterState.ageLimits.max}
            onChange={(e) => {
              dispatch({ maxAge: parseInt(e.target.value) })
            }}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={!filters.maxAge}
                onChange={(ev) => {
                  dispatch({
                    maxAge: ev.target.checked
                      ? undefined
                      : FilterState.ageLimits.max,
                  })
                }}
              />
            }
            label="Ignore max age"
          />
        </Grid>
      </Grid>
      <Grid item xs>
        <FormControl fullWidth>
          <InputLabel id="gender-select-label" htmlFor="gender-select">
            Gender
          </InputLabel>
          <Select
            id="gender-select"
            labelId="gender-select-label"
            disabled={!filters.genders}
            multiple
            value={filters.genders ?? []}
            onChange={(e) => {
              dispatch({ genders: e.target.value as Gender[] })
            }}
          >
            <MenuItem value={Gender.MALE}>Male</MenuItem>
            <MenuItem value={Gender.FEMALE}>Female</MenuItem>
            <MenuItem value={Gender.OTHER}>Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs>
        <Autocomplete
          disabled={!filters.interests}
          multiple
          clearOnBlur
          loading={loading}
          options={interestOptions}
          groupBy={(interest) => interest.category}
          getOptionLabel={(interest) => interest.title}
          getOptionSelected={(opt, val) => opt.id === val.id}
          value={filters.interests ?? []}
          onChange={(_, interests) => dispatch({ interests })}
          inputValue={interestInputValue}
          onInputChange={(_, value) => setInterestInputValue(value)}
          renderOption={(interest) => `${interest.category}: ${interest.title}`}
          renderTags={(interest, getTagProps) =>
            interest.map(({ category, title }, index) => (
              <Chip
                key={`interestChip-${index}`}
                variant="outlined"
                label={`${category}: ${title}`}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} label="Interests" />}
        />
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

function interestString(interest: Interest) {
  return `${interest.category}::${interest.title}`
}

export default function MatchingPage(): JSX.Element {
  const [match, next, enqueue, clearQ] = useQueue<Match>()
  const [filters, dispatch] = React.useReducer(
    (state: FilterState, action: Partial<FilterState>) => {
      clearQ()
      return { ...state, ...action }
    },
    new FilterState()
  )
  const [introVisible, setVisible] = React.useState<boolean>(false)
  const classes = useStyles()

  React.useEffect(() => {
    // TODO request more matches when match queue gets low
    request<Match[]>({
      path:
        "/api/matches/" +
        queryParams({
          ...filters,
          interests: filters.interests
            ? filters.interests.map((v) => v.id)
            : undefined,
        }),
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
            <Typography>
              Interests: {match.interests.map(interestString).join(", ")}
            </Typography>
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
