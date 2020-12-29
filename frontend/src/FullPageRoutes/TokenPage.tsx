import * as React from 'react';
import LinkItem from '../components/LinkItem';
import LoginForm, { UserHandlerArgs } from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { request } from '../utils/fetch';

type User = {
    username: string;
} & any;

type TokenResponse = {
    username: string;
    token: string;
};

type NavProps = {
    logged_in: boolean;
    display_form: (form: string) => void;
    handle_logout: () => void;
};
function Nav({ logged_in, display_form, handle_logout }: NavProps) {
    const LoggedOutNav = (
        <ul>
            <li
                onClick={() => {
                    display_form('login');
                }}
            >
                Login
            </li>
            <li
                onClick={() => {
                    display_form('signup');
                }}
            >
                Signup
            </li>
        </ul>
    );

    const LoggedInNav = (
        <ul>
            <li onClick={handle_logout}>Logout</li>
        </ul>
    );

    return <div>{logged_in ? LoggedInNav : LoggedOutNav}</div>;
}

export default function TokenPage() {
    const [displayedForm, setDisplayedForm] = React.useState<string>(null);
    const [logged_in, setLoggedIn] = React.useState<boolean>(
        localStorage.getItem('token') ? true : false
    );
    const [username, setUsername] = React.useState<string>(null);

    React.useEffect(() => {
        if (logged_in) {
            request<User>('/api/current_user/', 'get', true, false).then(
                (user) => {
                    setUsername(user.parsedBody.username);
                }
            );
        }
    });

    const handle_login = ({ e, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        request<TokenResponse>(
            '/api/token-auth/',
            'post',
            false,
            true,
            data
        ).then((json) => {
            localStorage.setItem('token', json.parsedBody.token);
            setLoggedIn(true);
            setUsername(json.parsedBody.username);
            setDisplayedForm(null);
        });
    };

    const handle_signup = ({ e, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        request<TokenResponse>('/api/users/', 'post', false, true, data).then(
            (json) => {
                localStorage.setItem('token', json.parsedBody.token);
                setLoggedIn(true);
                setDisplayedForm(null);
                setUsername(json.parsedBody.username);
            }
        );
    };

    const handle_logout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setUsername(null);
    };

    const display_form = (form) => {
        setDisplayedForm(form);
    };

    return (
        <>
            <ul>
                <LinkItem to='/' text='Home' />
            </ul>
            <div>
                <Nav
                    logged_in={logged_in}
                    display_form={display_form}
                    handle_logout={handle_logout}
                />
            </div>
            {displayedForm === 'login' ? (
                <LoginForm handle_login={handle_login} />
            ) : displayedForm === 'signup' ? (
                <SignupForm handle_signup={handle_signup} />
            ) : (
                <></>
            )}
            <h3>{logged_in ? `Hello, ${username}` : 'Please Log In'}</h3>
        </>
    );
}
