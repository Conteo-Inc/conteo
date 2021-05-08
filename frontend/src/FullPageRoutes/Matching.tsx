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
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import { Check, Block, Flag, PlayCircleFilled } from "@material-ui/icons"
import { request, queryParams } from "../utils/fetch"
import ViewVideo from "../components/video/ViewVideo"
import AbstractModal from "../components/AbstractModal"

type EnqueueFunc<T> = (...newItems: T[]) => void

type MatchControlsType = {
  matchId: number
  onAccept: (matchId: number) => void
  onReject: (matchId: number) => void
  onReport: (matchId: number, description?: string) => void
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
  readonly minAge = FilterState.ageLimits.min
  readonly maxAge = FilterState.ageLimits.max
  readonly genders = Object.values(Gender)
  readonly interests: Interest[] = []
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
  const [showReport, setShowReport] = React.useState<boolean>(false)
  const [description, setDescription] = React.useState<string>("")
  return (
    <Grid item container direction="row" justify="space-around">
      <AbstractModal
        title="Report"
        description="Optional report message"
        isModalOpen={showReport}
        handleConfirm={() => {
          setDescription("")
          setShowReport(false)
          onReport(matchId, description)
        }}
        handleCancel={() => {
          setDescription("")
          setShowReport(false)
        }}
      >
        <TextField
          multiline
          value={description}
          onChange={(ev) => setDescription(ev.currentTarget.value)}
        />
      </AbstractModal>
      <Button onClick={() => onAccept(matchId)}>
        <Check />
        Accept
      </Button>
      <Button onClick={() => onReject(matchId)}>
        <Block />
        Reject
      </Button>
      <Button onClick={() => setShowReport(true)}>
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
    <Grid container justify={"center"} spacing={2}>
      <Grid item>
        <TextField
          type="number"
          helperText="Min age"
          inputProps={FilterState.ageLimits}
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
          inputProps={FilterState.ageLimits}
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
      <Grid item>
        <Autocomplete
          multiple
          clearOnBlur
          loading={loading}
          options={interestOptions}
          groupBy={(interest) => interest.category}
          getOptionLabel={(interest) => interest.title}
          getOptionSelected={(opt, val) => opt.id === val.id}
          value={filters.interests}
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
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Interests" />
          )}
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
          interests: filters.interests.map((v) => v.id),
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

  const onReport = (matchId: number, description?: string) => {
    request({
      path: "/api/matches/",
      method: "put",
      body: { matchId, response: false },
    }).catch((err) => console.error(`Failed to update match status: ${err}`))
    request({
      path: "/api/reports/",
      method: "post",
      body: { report_type: "P", reportee: matchId, description },
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
