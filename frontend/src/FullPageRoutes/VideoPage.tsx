import * as React from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

function Preview({stream}:{stream:MediaStream|null}) {
    const ref = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) {
        return null;
    }
    return <video ref={ref} width={500} height={500} autoPlay controls />
}

export default function VideoPage() {
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewStream,
    } = useReactMediaRecorder({ video: true });
    return (
        <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop</button>
            <video src={mediaBlobUrl} controls autoPlay loop />
            <Preview stream={previewStream} />
        </div>
    );
}
