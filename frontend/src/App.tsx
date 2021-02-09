import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import ProfilePage from './FullPageRoutes/Profile';
import Dashboard from './FullPageRoutes/Dashboard';

export type User = {
    username: string;
} & any;

function MainPage() {
    return (
        <ul>
            <LinkItem to='/Tokens' text='Tokens' />
            <LinkItem to='/Profile' text='Profile' />
            <LinkItem to="/Dashboard" text="Dashboard"/>
        </ul>
    );
}

export default function App() {
    return (
        <Router>
            <Switch>
                <Route path='/Tokens'>
                    <TokenPage />
                </Route>
                <Route path='/Profile'>
                    <ProfilePage />
                </Route>
                <Route path="/Dashboard">
                    <Dashboard />
                </Route>
                <Route path='/'>
                    <MainPage />
                </Route>
            </Switch>
        </Router>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);
