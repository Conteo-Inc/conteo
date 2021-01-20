import * as React from 'react';
import { UserHandlerArgs } from './LoginForm';

type SignupFormProps = {
    handle_signup: ({ e, email, password }: UserHandlerArgs) => void;
    errorMessage: string | null;
};
export default function SignupForm({ handle_signup, errorMessage }: SignupFormProps) {
    const [email, setEmail] = React.useState<string>(null);
    const [password, setPassword] = React.useState<string>(null);


    // Clear Error message
    React.useEffect(() => {
        errorMessage = ""
    });

    return (
        //@TODO: This needs more info
        <form onSubmit={(e) => handle_signup({ e, errorMessage,  email, password })}>
            <h4>Sign Up</h4>
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
