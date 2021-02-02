import * as React from 'react';
export declare type UserHandlerArgs = {
    e: React.FormEvent<HTMLFormElement>;
    errorMessage: string | null;
    email: string | null;
    password: string | null;
};
declare type LoginFormProps = {
    handle_login: ({ e, email, password }: UserHandlerArgs) => void;
    errorMessage: string | null;
};
export default function LoginForm({ handle_login, errorMessage }: LoginFormProps): JSX.Element;
export {};
