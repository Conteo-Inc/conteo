import * as React from 'react';

export type UserHandlerArgs = {
    e: React.FormEvent<HTMLFormElement>;
    username: string | null;
    password: string | null;
};
type LoginFormProps = {
    handle_login: ({ e, username, password }: UserHandlerArgs) => void;
};

export default function LoginForm({ handle_login }: LoginFormProps) {
    const [username, setUsername] = React.useState<string>(null);
    const [password, setPassword] = React.useState<string>(null);

    return (
        <form onSubmit={(e) => handle_login({ e, username, password })}>
            <h4>Log In</h4>
            <label htmlFor='username'>Username</label>
            <input
                type='text'
                name='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor='password'>Password</label>
            <input
                type='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input type='submit' />
        </form>
    );
}
