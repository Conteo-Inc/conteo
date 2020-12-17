import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AuthExample from './AuthExample';

export default function App() {
    return (
        <Router>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                <Link to="/AuthExample">Auth Example</Link>
            </li>
            </ul>
            <Switch>
                <Route path="/AuthExample">
                    <AuthExample />
                </Route>
            </Switch>
        </Router>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);
