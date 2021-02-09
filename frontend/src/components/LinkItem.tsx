import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';

export type LinkItemType = Pick<LinkProps, 'to'> & {
    text: string;
};

export default function LinkItem({ to, text }: LinkItemType) {
    return (
        <li>
            <Link to={to}>{text}</Link>
        </li>
    );
}
