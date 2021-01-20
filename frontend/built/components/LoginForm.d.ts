import * as React from 'react';
export declare type UserHandlerArgs = {
    e: React.FormEvent<HTMLFormElement>;
    username: string | null;
    password: string | null;
};
declare type LoginFormProps = {
    handle_login: ({ e, username, password }: UserHandlerArgs) => void;
};
export default function LoginForm({ handle_login }: LoginFormProps): JSX.Element;
export {};
