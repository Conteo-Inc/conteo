import React from "react";
import styles from "../styles/Home.module.css";
import { Box, NoSsr, Typography } from "@material-ui/core";
import VideoStream from "../components/VideoStream";

export default function Home() {
  return (
    <NoSsr>
      <div className={styles.container}>
        <Box alignSelf="center" id="titleBanner">
          <Typography variant="h3">Main Page</Typography>
        </Box>
        <VideoStream />
      </div>
    </NoSsr>
  );
}
