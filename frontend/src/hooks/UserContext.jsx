import React, { createContext, useState, useContext } from 'react';

// Create a User Context
const UserContext = createContext();

// Custom hook to use the User Context
export const useUser = () => useContext(UserContext);

// User Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};