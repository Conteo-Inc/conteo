import * as React from "react"
import {
  TextField,
  Grid,
  makeStyles,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core"
import SearchIcon from "@material-ui/icons/Search"
import { useState } from "react"

type helpBtns = {
  href: string
  value: string
}

const useStyles = makeStyles({
  root: {
    "& .MuiGrid-root MuiGrid-item": {
      alignItems: "center",
      alignContent: "center",
    },
  },
  topBar: {
    margin: 1,
    padding: 50,
    backgroundColor: "rgb(238,235,228)",
  },
  bottomBar: {
    margin: 2,
    padding: 110,
  },
})

export default function Help(): JSX.Element {
  const classes = useStyles()
  const [search, getSearch] = useState("")
  const pages: helpBtns[] = [
    {
      href: "/contact",
      value: "Contact Us",
    },
    {
      href: "/faqs",
      value: "FAQs",
    },
    {
      href: "/tutorials",
      value: "Tutorials",
    },
  ]

  const handleSearch = (e: any) => {
    e.preventDefault()
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        className={classes.topBar}
      >
        <Grid item justify="center">
          <Typography variant="h3">Need some help?</Typography>
          <form>
            <TextField
              variant="outlined"
              label="Ask a question..."
              placeholder="Ask a question..."
              value={search}
              onChange={(e) => getSearch(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              Search
            </Button>
          </form>
        </Grid>

        <Grid item>
          <Grid
            container
            justify="center"
            alignItems="center"
            spacing={4}
            className={classes.bottomBar}
          >
            {pages.map(({ href, value }: helpBtns) => (
              <Grid key={value} item>
                <Card>
                  <CardContent>
                    <CardActions>
                      <Button href={href}> {value}</Button>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
