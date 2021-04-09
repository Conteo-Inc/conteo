import { Grid, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import * as React from "react"

const useStyles = makeStyles({
  footer: {
    backgroundColor: "#760000",
    height: "3rem",
    padding: "0 1rem",
    position: "fixed",
    left: 0,
    bottom: 0,
    zIndex: 1,
  },
  bannerText: {
    color: "white",
  },
})

export default function AppFooter(): JSX.Element {
  const classes = useStyles()
  return (
    <Grid
      item
      container
      direction="row"
      justify="space-between"
      alignItems="flex-end"
      className={classes.footer}
    >
      <Grid item lg={2}>
        <Grid container direction="row" justify="space-between">
          <Typography className={classes.bannerText}>
            {"Privacy Policy"}
          </Typography>
          <Typography className={classes.bannerText}>
            {"Terms of Service"}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container xs={1} alignContent="flex-end">
        <Typography className={classes.bannerText}>
          {"Copyright 2020"}
        </Typography>
      </Grid>
    </Grid>
  )
}
