import * as React from "react";
declare type AppContextType = {
    focusedUser: [number, React.Dispatch<React.SetStateAction<number>>];
};
export declare const AppContext: React.Context<AppContextType>;
export default function useFocusedUser(): [number, React.Dispatch<React.SetStateAction<number>>];
export {};
