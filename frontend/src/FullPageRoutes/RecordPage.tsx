import * as React from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { request } from '../utils/fetch';

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

function onStopRecording(blobUrl: string, blob: Blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const data = reader.result;
        request('/api/video/', 'post', true, true, {
            title: 'foo', //Temp, remove soon
            data: data,
        });
    };
}

export default function RecordPage() {
    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        previewStream,
    } = useReactMediaRecorder({ video: true, onStop: onStopRecording });
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
                <video src={mediaBlobUrl} controls />
            ) : (
                <Preview stream={previewStream} />
            )}
        </div>
    );
}
