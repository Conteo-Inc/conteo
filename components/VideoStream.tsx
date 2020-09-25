import { useEffect, useRef } from "react";
import { ReactMediaRecorder } from "react-media-recorder";

export type NullableStream = {
  stream: MediaStream | null;
};
export const VideoPreview = ({ stream }: NullableStream) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return stream ? <video ref={videoRef} autoPlay loop /> : null;
};

const VideoStream = () => (
  <div>
    <ReactMediaRecorder
      video
      render={({
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewStream,
      }) => {
        return (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <video src={mediaBlobUrl} controls autoPlay loop />
            <VideoPreview stream={previewStream} />
          </div>
        );
      }}
    />
  </div>
);

export default VideoStream;
