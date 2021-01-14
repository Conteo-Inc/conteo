import * as React from 'react';

export type UserHandlerArgs = {
    e: React.FormEvent<HTMLFormElement>;
    errorMessage: string | null
    email: string | null;
    password: string | null;
};
type LoginFormProps = {
    handle_login: ({ e, email, password }: UserHandlerArgs) => void;
    errorMessage: string | null;
};

export default function LoginForm({ handle_login, errorMessage }: LoginFormProps) {
    const [email, setEmail] = React.useState<string>(null);
    const [password, setPassword] = React.useState<string>(null);
    
    // Clear Error message
    React.useEffect(() => {
        errorMessage = ""
    });


    return (
        <form onSubmit={(e) => handle_login({ e, errorMessage, email, password })}>
            <h4>Log In</h4>
            <label htmlFor='email'>Email</label>
            <input
                type='email'
                name='email'
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <br/>
            <br/>
            <label htmlFor='password'>Password</label>
            <input
                type='password'
                name='password'
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br/>
            <span>{errorMessage}</span> 
            <br/>
            <input type='submit' />
        </form>
    );
}
