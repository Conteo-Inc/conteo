import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import DashboardPage from './FullPageRoutes/DashboardPage';



function MainPage() {
    return (
        <ul>
            <LinkItem to='/Tokens' text='Tokens' />
            <LinkItem to='/Dashboard' text='Dashboard' />
        </ul>
    );
}

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/Dashboard'>
                   
                    < DashboardPage />
                </Route>
                <Route exact path='/Tokens'>
                    <TokenPage />
                </Route>
                <Route exact path='/'>
                    <MainPage />
                </Route>
              
            </Switch>
        </Router>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);
