/// <reference types="react" />
import { StatusMessages } from 'react-media-recorder';
declare type ControlsProps = {
    status: StatusMessages;
    startRecording: () => void;
    stopRecording: () => void;
    sendVideo: () => void;
};
export default function Controls({ status, startRecording, stopRecording, sendVideo, }: ControlsProps): JSX.Element;
export {};
