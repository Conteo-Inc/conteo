import * as React from 'react';
import { useReactMediaRecorder, StatusMessages } from 'react-media-recorder';

function Preview({ stream }: { stream: MediaStream | null }) {
    const ref = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (ref.current && stream) {
            ref.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) {
        return null;
    }
    return <video ref={ref} width={500} height={500} autoPlay controls />;

}

function onStopRecording(blobUrl: string, blob:Blob) {
    console.log("blobUrl:", blobUrl, "blob object:", blob)
}

export default function RecordPage() {
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewStream,
    } = useReactMediaRecorder({ video: true, onStop:onStopRecording });
    console.log(mediaBlobUrl);
    return (
        <div>
            <p>{status}</p>
            {status === 'idle' ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : status === 'recording' ? (
                <button onClick={stopRecording}>Stop</button>
            ) : (
                <button disabled>Loading...</button>
            )}
            {mediaBlobUrl ? (
                <video src={mediaBlobUrl} controls autoPlay loop />
            ) : (
                <Preview stream={previewStream} />
            )}
        </div>
    );
}
