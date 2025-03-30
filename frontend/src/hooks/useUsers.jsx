import { useEffect, useState } from 'react';

const useUsers = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/auth/total-users');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data); // Log the response data
                if (typeof data.total_users !== 'number') {
                    throw new Error("Invalid data: total_users is not a number");
                }
                setTotalUsers(data.total_users);
            } catch (err) {
                console.error("Error fetching total users:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return { totalUsers, loading, error };
};

export default useUsers;