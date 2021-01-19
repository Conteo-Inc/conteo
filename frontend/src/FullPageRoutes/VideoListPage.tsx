import * as React from 'react';
import { request } from '../utils/fetch';

type Video = {
    id: number;
    title: string;
};

export default function VideoListPage() {
    const [videos, setVideos] = React.useState([]);

    React.useEffect(() => {
        request<Video[]>('/api/video/', "get", true, false).then((res) => {
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
