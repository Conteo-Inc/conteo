import * as React from 'react';

type MailListItem = {
    fullName: string;
    date: string;
};
const mail: MailListItem[] = [
    { fullName: 'John Doe', date: 'Oct 22' },
    { fullName: 'John Doe Jr.', date: 'Oct 22' },
    { fullName: 'Thomas Jones', date: 'Oct 20' },
];

function getMail(): MailListItem[] {
    return mail;
}

export default function MailList() {
    // Here we need to call the getMail function, which will eventually hit the necessary endpoint
    // You should probably use React.useEffect to call it during load,
    // and React.useState to set the state

    //Your html goes here.
    //The <> </> is shorthand for an empty div
    return (
        <></>
    );
}
