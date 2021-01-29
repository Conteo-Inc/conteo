import * as React from 'react';

export default function Dashboard({ email, handle_logout}) {

    return (
        <>
        <h1>Hello {email}</h1>
        <ul>
            <li onClick={handle_logout}>Logout</li>
        </ul>
        </>
    );
}
