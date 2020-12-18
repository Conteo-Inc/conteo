/// <reference types="react" />
import { LinkProps } from 'react-router-dom';
export declare type LinkItemType = Pick<LinkProps, 'to'> & {
    text: string;
};
export default function LinkItem({ to, text }: LinkItemType): JSX.Element;
