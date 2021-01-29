import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import Dashboard from './FullPageRoutes/Dashboard';
import TokenPage from './FullPageRoutes/TokenPage';

function MainPage() {
    return (
        <ul>
            <LinkItem to='/Tokens' text='Tokens' />
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
                <Route path='/'>
                    <Dashboard />
                </Route>
            </Switch>
        </Router>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);
