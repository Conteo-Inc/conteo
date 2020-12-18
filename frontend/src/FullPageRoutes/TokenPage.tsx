import * as React from 'react';
import LinkItem from '../components/LinkItem';
import LoginForm, { UserHandlerArgs } from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

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
            fetch('/api/current_user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    setUsername(json.username);
                });
        }
    });

    const handle_login = ({ e, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        fetch('/api/token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((json) => {
                localStorage.setItem('token', json.token);
                setLoggedIn(true);
                setUsername(json.username);
                setDisplayedForm(null);
            });
    };

    const handle_signup = ({ e, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        fetch('/api/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((json) => {
                localStorage.setItem('token', json.token);
                setLoggedIn(true);
                setDisplayedForm(null);
                setUsername(json.username);
            });
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
            <h3>{logged_in ? `Hello, ${ username }` : 'Please Log In'}</h3>
        </>
    );
}
