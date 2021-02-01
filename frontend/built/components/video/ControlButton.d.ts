import * as React from 'react';
import { ColorsType } from '../../utils/colors';
declare type ControlButtonProps = {
    ariaLabel?: string;
    color?: ColorsType;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    size?: 'inherit' | 'default' | 'small' | 'large';
    type: 'start' | 'stop' | 'send' | 'loading';
    disabled?: boolean;
};
export default function ControlButton({ ariaLabel, color, onClick, size, type, disabled, }: ControlButtonProps): JSX.Element;
export {};
