import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import RecordPage from './FullPageRoutes/RecordPage';
import VideoListPage from './FullPageRoutes/VideoListPage';

function MainPage() {
    return (
        <ul>
            <LinkItem to='/Tokens' text='Tokens' />
            <LinkItem to='/Record' text='Record' />
            <LinkItem to='/Watch' text='Watch' />
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
                <Route path='/Record'>
                    <RecordPage />
                </Route>
                <Route path='/Watch'>
                    <VideoListPage />
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
