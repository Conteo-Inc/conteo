import * as React from 'react';

export type UserHandlerArgs = {
    e: React.FormEvent<HTMLFormElement>;
    errorMessage: string | null
    username: string | null;
    password: string | null;
};
type LoginFormProps = {
    handle_login: ({ e, username, password }: UserHandlerArgs) => void;
    errorMessage: string;
};

export default function LoginForm({ handle_login, errorMessage }: LoginFormProps) {
    const [username, setUsername] = React.useState<string>(null);
    const [password, setPassword] = React.useState<string>(null);

    return (
        <form onSubmit={(e) => handle_login({ e, errorMessage, username, password })}>
            <h4>Log In</h4>
            <label htmlFor='username'>Username</label>
            <input
                type='text'
                name='username'
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br/>
            <br/>
            <label htmlFor='password'>Password</label>
            <input
                type='password'
                name='password'
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br/>
            <span>{errorMessage}</span> 
            <br/>
            <input type='submit' />
        </form>
    );
}
