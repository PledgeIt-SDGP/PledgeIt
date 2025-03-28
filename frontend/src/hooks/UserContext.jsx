import { createContext, useState, useContext, useEffect } from 'react'; // Also works

// Create context with a default value (optional but helpful for TypeScript)
const UserContext = createContext({
    user: null,
    setUser: () => { },
    logout: () => { },
    isLoading: true,
});

// Custom hook for easy access
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    // Logout function (clears user and localStorage)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUser(null);
    };

    // Optional: Auto-login if token exists (alternative to AppRoutes.jsx logic)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch user data here if needed
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};