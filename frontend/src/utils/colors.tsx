import { colors } from '@material-ui/core';

export const Colors = {
    DEEP_RED: colors.red[900],
    DEEP_BLUE: colors.blue[900],
};

export type ColorsType = typeof Colors['DEEP_RED'] | typeof Colors['DEEP_BLUE'];
