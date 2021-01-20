import { strict } from 'assert';
import { type } from 'os';
import * as React from 'react';
import LinkItem from '../components/LinkItem';
import LoginForm, { UserHandlerArgs } from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import { request } from '../utils/fetch';

type User = {
    email: string;
} & any;

type TokenResponse = {
    email: string;
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

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export default function TokenPage() {
    const [displayedForm, setDisplayedForm] = React.useState<string>(null);
    const [logged_in, setLoggedIn] = React.useState<boolean>(
        localStorage.getItem('token') ? true : false
    );
    const [email, setEmail] = React.useState<string>(null);
    const [errMessage, seterrMessage] = React.useState<string>(null);


    React.useEffect(() => {
        seterrMessage(null)    
    }, [displayedForm]);

    // The below code shouldn't be here. We should have a new page which is like dashboard or profile page to determine if we need to get the current user's data
    // React.useEffect(() => {
    //     if (logged_in) {
    //         request<User>('/api/current_user/', 'get', true, false)
    //         .then(handleErrors)
    //         .then((user) => {
    //             console.log("success")
    //             console.log(user)
    //                 // setEmail(user.parsedBody.email);
    //         })
    //         .catch(error =>{
    //             // Set error message based on error type
    //         });
    //     }
    // }, [displayedForm]);

    const handle_login = ({ e, errorMessage, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        request<TokenResponse>(
            '/api/login/',
            'post',
            false,
            true,
            data
        ).then(handleErrors)
        .then((json) => {
            localStorage.setItem('token', json.parsedBody.token);
            setLoggedIn(true);
            setEmail(json.parsedBody.email);
            setDisplayedForm(null);
            seterrMessage(null)
        }).catch(error =>{
            seterrMessage("Incorrect email or password")   // Set error message based on error type
        });
    };

    const handle_signup = ({ e, errorMessage, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        request<TokenResponse>('/api/signup/', 'post', false, true, data)
        .then(handleErrors)
        .then((resp)=>{
            localStorage.setItem('token', resp.parsedBody.token);
            setLoggedIn(true);
            setDisplayedForm(null);
            setEmail(resp.parsedBody.email);
        })
        .catch(error =>{
            seterrMessage("Incorrect email or password")   // Set error message based on error type later
        });
    }

    const handle_logout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setEmail(null);
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
                <LoginForm handle_login={handle_login} errorMessage={errMessage}/>
            ) : displayedForm === 'signup' ? (
                <SignupForm handle_signup={handle_signup} errorMessage={errMessage}/>
            ) : (
                <></>
            )}
            <h3>{logged_in ? `Hello, ${email}` : 'Please Log In'}</h3>
        </>
    );
}
