import * as React from 'react';
import { get } from '../utils/fetch';

type Video = {
    id: number;
    title: string;
};

export default function VideoListPage() {
    const [videos, setVideos] = React.useState([]);

    React.useEffect(() => {
        get<Video[]>('/api/video/').then((res) => {
            setVideos(res.parsedBody);
        });
    });

    return (
        <ul>
            {videos.map((video, index) => (
                <li key={'video' + index}>{video.title}</li>
            ))}
        </ul>
    );
}
