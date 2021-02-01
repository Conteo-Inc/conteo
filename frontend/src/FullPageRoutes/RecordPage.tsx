import * as React from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Grid, makeStyles } from '@material-ui/core';
import Controls from '../components/video/Controls';
import { request } from '../utils/fetch';
import useFocusedUser from '../utils/context';

const useStyles = makeStyles({
    video_root: {
        backgroundColor: 'black',
        width: 1066,
        height: 700,
    },
});

type PreviewProps = {
    stream: MediaStream | null;
};
function Preview({ stream }: PreviewProps) {
    const ref = React.useRef<HTMLVideoElement>(null);
    const classes = useStyles();

    React.useEffect(() => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) {
        return null;
    }
    return <video ref={ref} className={classes.video_root} autoPlay />;
}

function sendVideo(blob: Blob, receiver: number) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        request('/api/video/', 'post', true, true, {
            receiver: receiver,
            data: reader.result,
        });
    };
}

export default function RecordPage() {
    const [videoBlob, setVideoBlob] = React.useState<Blob>(null);
    const [focusedUser] = useFocusedUser();

    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewStream,
    } = useReactMediaRecorder({
        video: true,
        onStop: (_, blob) => setVideoBlob(blob),
    });

    const classes = useStyles();
    return (
        <Grid container justify='center'>
            {mediaBlobUrl ? (
                <video
                    src={mediaBlobUrl}
                    controls
                    className={classes.video_root}
                />
            ) : (
                <Preview stream={previewStream} />
            )}
            <Controls
                status={status}
                startRecording={startRecording}
                stopRecording={stopRecording}
                sendVideo={() => sendVideo(videoBlob, focusedUser)}
            />
        </Grid>
    );
}
