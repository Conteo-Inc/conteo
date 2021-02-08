import * as React from 'react';
import LoginForm, {
    UserHandlerArgs,
    ColorButton,
} from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import Dashboard from '../components/Dashboard';
import { request } from '../utils/fetch';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type TokenResponse = {
    username: string;
    token: string;
};

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const useStyles = makeStyles({
    paperStyle: {
        padding: 20,
        width: 280,
        margin: '20px auto',
    },
    btnStyle: {
        margin: '8px 0',
    },
    pageStyle: {
        margin: '100px auto',
    },
});

export default function TokenPage() {
    const [displayedForm, setDisplayedForm] = React.useState<string>(null);
    const [logged_in, setLoggedIn] = React.useState<boolean>(
        localStorage.getItem('token') ? true : false
    );
    const [email, setEmail] = React.useState<string>(null);
    const [errMessage, seterrMessage] = React.useState<string>(null);
    const classes = useStyles();

    React.useEffect(() => {
        seterrMessage(null);
    }, [displayedForm, logged_in]);

    const handle_login = ({ e, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        request<TokenResponse>('/api/login/', 'post', true, data).then(
            (json) => {
                setLoggedIn(true);
                setEmail(json.parsedBody.username);
                setDisplayedForm(null);
                seterrMessage(null);
            }
        );
    };

    const handle_signup = ({ e, ...data }: UserHandlerArgs) => {
        e.preventDefault();
        request<TokenResponse>('/api/register/', 'post', true, data).then(
            (resp) => {
                setLoggedIn(true);
                setDisplayedForm(null);
                setEmail(resp.parsedBody.username);
            }
        );
    };

    const handle_logout = () => {
        request('/api/logout/', 'post', true).then((resp) => {
            setLoggedIn(false);
            setEmail(null);
            setDisplayedForm('login');
        });
    };

    const display_form = (form) => {
        setDisplayedForm(form);
    };

    return (
        <>
            {logged_in === true ? (
                <Dashboard handle_logout={handle_logout} email={email} />
            ) : displayedForm === 'signup' ? (
                <SignupForm
                    handle_signup={handle_signup}
                    errorMessage={errMessage}
                />
            ) : (
                <Grid container className={classes.pageStyle}>
                    <Grid
                        container
                        spacing={0}
                        direction='column'
                        alignItems='center'
                        justify='center'
                        item
                        sm
                    >
                        <Paper className={classes.paperStyle}>
                            <ColorButton
                                type='submit'
                                variant='contained'
                                fullWidth
                                className={classes.btnStyle}
                                onClick={() => {
                                    display_form('signup');
                                }}
                            >
                                Sign Up
                            </ColorButton>
                        </Paper>
                    </Grid>
                    <Grid
                        container
                        spacing={0}
                        direction='column'
                        alignItems='center'
                        justify='center'
                        item
                        sm
                    >
                        <LoginForm
                            handle_login={handle_login}
                            errorMessage={errMessage}
                        />
                    </Grid>
                </Grid>
            )}
        </>
    );
}
