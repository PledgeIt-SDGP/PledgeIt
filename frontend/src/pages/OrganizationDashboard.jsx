import React from 'react';
import { useUser } from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrganizationDashboard = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the JWT token
            await axios.post(
                'http://127.0.0.1:8000/auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                    withCredentials: true, // Ensure cookies are sent with the request
                }
            );
            setUser(null); // Clear user context
            localStorage.removeItem('token'); // Remove token from localStorage
            navigate('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(
                    'http://127.0.0.1:8000/auth/organization/delete',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                setUser(null);
                localStorage.removeItem('token');
                navigate('/login');
            } catch (error) {
                console.error('Account deletion failed:', error);
            }
        }
    };

    return (
        <div>
            <p>Hello Organization</p>
            {user && (
                <div>
                    <h2>Welcome, {user.name}!</h2>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                        Logout
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 mt-4"
                    >
                        Delete Account
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrganizationDashboard;