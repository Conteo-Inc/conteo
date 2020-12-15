import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function App() {
    return (
        <Router>
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                {/* <li>
                <Link to="/foo">Foo</Link>
            </li> */}
            </ul>
        </Router>
    );
}

// export default App;

const container = document.getElementById('app');
render(<App />, container);
