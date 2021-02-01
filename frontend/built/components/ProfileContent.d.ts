/// <reference types="react" />
export declare type ProfileContentProps = {
    username: string;
    name: string;
    profileImg: string;
    gender: string;
    religion: string;
    location: string;
    occupations: string[];
    age: number | string;
    interests: string[];
};
export default function ProfileContent(props: ProfileContentProps): JSX.Element;
