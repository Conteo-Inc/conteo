import * as React from 'react';

// Define the type so that createContext understands what to expect for focusedUser
type AppContextType = {
    focusedUser: [number, React.Dispatch<React.SetStateAction<number>>];
};

// Even though this is initialized as null, using it will supply the correct type
export const AppContext = React.createContext<AppContextType>({
    focusedUser: null,
});

export default function useFocusedUser() {
    const context = React.useContext(AppContext);
    return context.focusedUser;
}
