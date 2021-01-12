import * as React from 'react';
import { UserHandlerArgs } from './LoginForm';

type SignupFormProps = {
    handle_signup: ({ e, username, password }: UserHandlerArgs) => void;
};
export default function SignupForm({ handle_signup }: SignupFormProps) {
    const [username, setUsername] = React.useState<string>(null);
    const [password, setPassword] = React.useState<string>(null);

    return (
        //@TODO: This needs more info
        <form onSubmit={(e) => handle_signup({ e, username, password })}>
            <h4>Sign Up</h4>
            <label htmlFor='username'>Username</label>
            <input
                type='text'
                name='username'
                value={username || ""}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor='password'>Password</label>
            <input
                type='password'
                name='password'
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input type='submit' />
        </form>
    );
}
