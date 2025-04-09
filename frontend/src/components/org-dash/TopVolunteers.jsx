import React, { useState, useEffect } from 'react';
import { useUser } from '../../hooks/UserContext';
import axios from "axios";

const TopVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchTopVolunteers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/volunteers/leaderboard');
        setVolunteers(response.data);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopVolunteers();
  }, []);

  const getMedalColor = (index) => {
    switch(index) {
      case 0: return 'bg-gradient-to-b from-yellow-400 to-yellow-500 text-white';
      case 1: return 'bg-gradient-to-b from-gray-300 to-gray-400 text-white';
      case 2: return 'bg-gradient-to-b from-amber-600 to-amber-700 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCurrentUser = (volunteerId) => {
    return user && user.role === 'volunteer' && user.id === volunteerId;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-1">Top Volunteers</h3>
      <p className="text-gray-500 text-sm mb-6">Ranked by participation points</p>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : (
        <div className="space-y-3">
          {volunteers.map((volunteer, index) => (
            <div 
              key={volunteer.id} 
              className={`flex items-center p-3 rounded-lg transition-all ${
                isCurrentUser(volunteer.id) 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'bg-gray-50 hover:bg-gray-100'
              } ${index < 3 ? 'shadow-sm' : ''}`}
            >
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getMedalColor(index)} mr-3`}>
                {index + 1}
              </div>
              
              <img 
                src={volunteer.avatar || 'https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658607/volunteer_m1ywl0.png'} 
                alt={volunteer.name}
                className={`h-10 w-10 rounded-full object-cover mr-3 ${
                  index < 3 ? 'ring-2 ring-offset-2' : ''
                } ${
                  index === 0 ? 'ring-yellow-400' :
                  index === 1 ? 'ring-gray-300' :
                  index === 2 ? 'ring-amber-600' : ''
                }`}
              />
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  isCurrentUser(volunteer.id) ? 'text-blue-600' : 'text-gray-800'
                }`}>
                  {volunteer.name}
                  {isCurrentUser(volunteer.id) && (
                    <span className="ml-1 text-blue-400">(You)</span>
                  )}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {volunteer.points} pts
                  </span>
                  <span className="text-xs text-gray-500">
                    {volunteer.events_attended} events
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopVolunteers;