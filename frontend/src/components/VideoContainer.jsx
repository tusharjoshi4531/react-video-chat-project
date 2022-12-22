import { Paper, Stack, Typography } from "@mui/material";
import { forwardRef } from "react";

const VideoContainer = forwardRef(({ name, muted }, ref) => {
  return (
    <Paper elevation={8}>
      <Stack
        height={300}
        width={300}
        bgcolor="black"
        justifyContent="space-evenly"
      >
        <video
          ref={ref}
          autoPlay
          muted={muted}
          playsInline
          style={{ width: "300px" }}
        />
        <Typography variant="h5" color="white">
          {name}
        </Typography>
      </Stack>
    </Paper>
  );
});

export default VideoContainer;
