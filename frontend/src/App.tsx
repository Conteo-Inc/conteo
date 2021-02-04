import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LinkItem from './components/LinkItem';
import TokenPage from './FullPageRoutes/TokenPage';
import ProfilePage from './FullPageRoutes/Profile';
import Notification from './components/Notification';
import {notificationType} from './components/Notification';
import {modalType} from './components/AbstractModal';
import AbstractModal from './components/AbstractModal';

export type User = {
    username: string;
} & any;

function MainPage() {
    const [notify, setNotify] = React.useState<notificationType>({isOpen: false, message: 'Nothing works', type: 'success'});
    const [modal, setModal] = React.useState<modalType>({isOpen: false, title: "", description: "", confirmText: "", cancelText: "", handleConfirm: null, handleCancel: null});
    
    const handleClick = (e) =>{
        e.preventDefault();
        const updatedDataObj: notificationType = {
            isOpen: true,
            message: 'Submitted Successfully',
            type: 'success'
        };
        setNotify(updatedDataObj);
    }

    const handleModal = (e) =>{
        e.preventDefault();
        const modalupdatedDataObj: modalType = {
            ...modal,
            isOpen: true, 
            title: "Are you sure you want to delete this dialog?", 
            description: "You can't undo this operation", 
            confirmText: "YES", 
            cancelText: "NO",
            handleCancel: cancel
        };
        setModal(modalupdatedDataObj);
    }

    const cancel = (e)=>{
        e.preventDefault()
        setModal({...modal, isOpen: false})
    }

    return (
        <ul>
            <LinkItem to='/Tokens' text='Token' />
            <LinkItem to='/Profile' text='Profile' />
            <br/>
            <br/>
            <button onClick={handleClick} >Open Notification</button>
            <br/>
            <br/> 
            <br/>
            <button onClick={handleModal}> Open Modal </button>
            <Notification {...notify} />
            <AbstractModal {...modal} />
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
