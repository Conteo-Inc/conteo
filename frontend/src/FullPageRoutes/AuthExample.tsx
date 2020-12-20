import * as React from 'react';
import {
    Link,
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
    useHistory,
    useLocation,
} from 'react-router-dom';
import { get, post } from '../utils/fetch';

// const fakeAuth = {
//     isAuthenticated: false,
//     signin(cb: () => void) {
//         fakeAuth.isAuthenticated = true;
//         setTimeout(cb, 100);
//     },
//     signout(cb: () => void) {
//         fakeAuth.isAuthenticated = false;
//         setTimeout(cb, 100);
//     },
// };

const authContext = React.createContext(null);
function useAuth() {
    return React.useContext(authContext);
}
function useProvideAuth() {
    const [user, setUser] = React.useState(null);

    const signin = (cb) => {
        // return fakeAuth.signin(() => {
        //     setUser('user');
        //     cb();
        // });
    };
    const signout = (cb) => {
        // return fakeAuth.signout(() => {
        //     setUser(null);
        //     cb();
        // });
    };

    return {
        user,
        signin,
        signout,
    };
}

export default function AuthExample() {
    return (
        <ProvideAuth>
            <Router>
                <div>
                    <AuthButton />
                    <ul>
                        <li>
                            <Link to='/AuthExample/public'>Public Page</Link>
                        </li>
                        <li>
                            <Link to='/AuthExample/protected'>
                                Protected Page
                            </Link>
                        </li>
                    </ul>

                    <Switch>
                        <Route path='/AuthExample/public'>
                            <PublicPage />
                        </Route>
                        <Route path='/AuthExample/login'>
                            <LoginPage />
                        </Route>
                        <PrivateRoute path='/AuthExample/protected'>
                            <ProtectedPage />
                        </PrivateRoute>
                    </Switch>
                </div>
            </Router>
        </ProvideAuth>
    );
}

function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
function AuthButton() {
    const history = useHistory();
    const auth = useAuth();

    return auth.user ? (
        <p>
            Welcome!{' '}
            <button
                onClick={() => {
                    auth.signout(() => history.push('/AuthExample/'));
                }}
            >
                Sign Out
            </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}

function PrivateRoute({ children, ...rest }) {
    const auth = useAuth();
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/AuthExample/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
}

function PublicPage() {
    return <h3>Public</h3>;
}
function ProtectedPage() {
    return <h3>Protected</h3>;
}
function LoginPage() {
    const history = useHistory();
    const location = useLocation();
    const auth = useAuth();

    const { from }: any = location.state || {
        from: { pathname: '/AuthExample/' },
    };
    const login = () => {
        auth.signin(() => {
            history.replace(from);
        });
    };

    return (
        <div>
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={login}>Log In</button>
        </div>
    );
}
