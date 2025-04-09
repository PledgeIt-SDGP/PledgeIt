import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/UserContext';
import axios from "axios";

const AttendanceConfirmation = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useUser();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        const confirmAttendance = async () => {
            try {
                if (!user) {
                    navigate('/login', { state: { from: `/events/${eventId}/confirm` } });
                    return;
                }

                const eventRes = await axios.get(`http://127.0.0.1:8000/events/${eventId}`);
                setEvent(eventRes.data);

                const confirmRes = await axios.post(`http://127.0.0.1:8000/events/${eventId}/scan`);
                setPointsEarned(confirmRes.data.points_added);
                setTotalPoints(confirmRes.data.total_points);
                setSuccess(true);
                await refreshUser();
            } catch (err) {
                navigate(`/events/${eventId}`, {
                    state: { error: err.response?.data?.detail || 'Failed to confirm attendance' }
                });
            } finally {
                setLoading(false);
            }
        };

        confirmAttendance();
    }, [eventId, user, navigate, refreshUser]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Confirming your attendance...</p>
            </div>
        );
    }

    if (!success || !event) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Attendance Confirmed!</h1>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">{event.event_name}</h2>
                    <p className="text-gray-600">Organized by {event.organization}</p>
                    <p className="text-gray-500 text-sm">
                        {new Date(event.date).toLocaleDateString()} • {event.time}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-6 py-2 rounded-full mb-2">
                        +{pointsEarned} pts
                    </div>
                    <p className="text-gray-600">
                        Your total points: <span className="font-bold">{totalPoints}</span>
                    </p>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={() => navigate(`/events/${eventId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        View Event Details
                    </button>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 border border-gray-300 rounded-lg transition"
                    >
                        Check Leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceConfirmation;