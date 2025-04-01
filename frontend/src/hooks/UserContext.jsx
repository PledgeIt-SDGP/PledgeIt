import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext({
    user: null,
    setUser: () => {},
    logout: () => {},
    isLoading: true,
    refreshUser: () => {},
});

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }
            
            const response = await axios.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setUser(null);
    };

    const refreshUser = async () => {
        await fetchUserData();
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser, 
            logout, 
            isLoading,
            refreshUser 
        }}>
            {children}
        </UserContext.Provider>
    );
};