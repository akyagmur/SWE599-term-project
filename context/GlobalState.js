import { createContext } from "react";

export const GlobalState = createContext();

export const GlobalProvider = ({ props, children }) => {
    return (
        <GlobalState.Provider value={props}>{children}</GlobalState.Provider>
    );
}