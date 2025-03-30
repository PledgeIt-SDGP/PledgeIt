import { useEffect, useState } from 'react';

const useEvents = () => {
    const [totalEvents, setTotalEvents] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/events/total-events');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data); // Log the response data
                if (typeof data.total_events !== 'number') {
                    throw new Error("Invalid data: total_events is not a number");
                }
                setTotalEvents(data.total_events);
            } catch (err) {
                console.error("Error fetching total events:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { totalEvents, loading, error };
};

export default useEvents;