import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import ProfilePage from './FullPageRoutes/Profile';
import Notification from './components/Notification';
import {notificationType} from './components/Notification';

export type User = {
    username: string;
} & any;

function MainPage() {
    const [notify, setNotify] = React.useState<notificationType>({isOpen: false, message: 'Nothing works', type: 'success'});
    
    const handleClick = (e) =>{
        e.preventDefault();
        const updatedDataObj: notificationType = {
            isOpen: true,
            message: 'Submitted Successfully',
            type: 'success'
        };
        setNotify(updatedDataObj);
    }

    return (
        <ul>
            <LinkItem to='/Tokens' text='Token' />
            <LinkItem to='/Profile' text='Profile' />
            <button onClick={handleClick} >Click me</button>
            <br/> 
            <Notification {...notify} />
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
