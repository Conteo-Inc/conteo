import { IconButton } from '@material-ui/core';
import {
    Block,
    PauseCircleFilled,
    PlayCircleFilled,
    SendRounded,
} from '@material-ui/icons';
import * as React from 'react';
import { ColorsType } from '../../utils/colors';

type ControlButtonProps = {
    ariaLabel?: string;
    color?: ColorsType;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    size?: 'inherit' | 'default' | 'small' | 'large';
    type: 'start' | 'stop' | 'send' | 'loading';
    disabled?: boolean;
};

function Button({ type, size }: Pick<ControlButtonProps, 'type' | 'size'>) {
    return type === 'start' ? (
        <PlayCircleFilled fontSize={size} />
    ) : type === 'stop' ? (
        <PauseCircleFilled fontSize={size} />
    ) : type === 'send' ? (
        <SendRounded fontSize={size} />
    ) : (
        <Block fontSize={size} />
    );
}

export default function ControlButton({
    ariaLabel,
    color,
    onClick,
    size = 'default',
    type,
    disabled = false,
}: ControlButtonProps) {
    return (
        <IconButton
            aria-label={ariaLabel}
            onClick={!disabled ? onClick : () => {}}
            disabled={disabled}
            style={{ color: color }}
        >
            <Button type={type} size={size} />
        </IconButton>
    );
}
