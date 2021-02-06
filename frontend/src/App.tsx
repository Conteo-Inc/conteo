import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import ProfilePage from './FullPageRoutes/Profile';
import { AppContext } from './utils/context';
import RecordPage from './FullPageRoutes/RecordPage';
import VideoListPage from './FullPageRoutes/VideoListPage';

export type User = {
    username: string;
} & any;

//@TODO: Move links to common file
function MainPage() {
    return (
        <ul>
            <LinkItem to='/Tokens' text='Tokens' />
            <LinkItem to='/Record' text='Record' />
            <LinkItem to='/Watch' text='Watch' />
            <LinkItem to='/Profile' text='Profile' />
        </ul>
    );
}

export default function App() {
    return (
        <AppContext.Provider
            value={{ focusedUser: React.useState<number>(null) }}
        >
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
                    <Route path='/Profile'>
                        <ProfilePage />
                    </Route>
                    <Route path='/'>
                        <MainPage />
                    </Route>
                </Switch>
            </Router>
        </AppContext.Provider>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);