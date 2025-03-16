import React from 'react';
import { useUser } from '../hooks/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrganizationDashboard = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    console.log("User in OrganizationDashboard:", user); // Log the user object

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://127.0.0.1:8000/auth/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            setUser(null); // Clear user context
            localStorage.removeItem('token'); // Remove token
            localStorage.removeItem('userRole'); // Remove user role
            navigate('/'); // Redirect to login page
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
                navigate('/');
            } catch (error) {
                console.error('Account deletion failed:', error);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <p className="text-2xl font-bold mb-4">Hello Organization</p>
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-4 mb-6">
                        {user.logo && (
                            <img
                                src={user.logo}
                                alt="Organization Logo"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        )}
                        <h2 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-lg text-gray-800">{user.email}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Website</label>
                            <p className="text-lg text-gray-800">
                                <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {user.website_url}
                                </a>
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">About</label>
                            <p className="text-lg text-gray-800">{user.about}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Organization Type</label>
                            <p className="text-lg text-gray-800">{user.organization_type}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Causes Supported</label>
                            <ul className="list-disc list-inside text-lg text-gray-800">
                                {user.causes_supported && user.causes_supported.map((cause, index) => (
                                    <li key={index}>{cause}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Contact Number</label>
                            <p className="text-lg text-gray-800">{user.contact_number}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Address</label>
                            <p className="text-lg text-gray-800">{user.address}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-x-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizationDashboard;