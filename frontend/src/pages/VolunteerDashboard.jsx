import React from 'react';
import { useUser } from '../hooks/UserContext'; // Import useUser hook

const VolunteerDashboard = () => {
    const { user } = useUser(); // Get user from User Context

    return (
        <div>
            <p>Hello Volunteer</p>
            {user && (
                <div>
                    <h2>Welcome, {user.name}!</h2>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            )}
        </div>
    );
};

export default VolunteerDashboard;