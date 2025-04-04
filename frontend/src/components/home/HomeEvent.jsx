import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext"; // Adjust path as needed

const HomeEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const handleViewMore = (eventId) => {
    if (!user) {
      navigate('/login', { state: { from: `/details/${eventId}` } });
    } else {
      navigate(`/details/${eventId}`);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/events");
        if (!response.ok) throw new Error(`Failed to load events. Status: ${response.status}`);

        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-10">Loading events...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="my-10 relative">
      <div
        ref={carouselRef}
        className="flex gap-7 overflow-x-auto scrollbar-hide whitespace-nowrap px-3 py-4"
      >
        {events.map((event) => (
          <div
            key={event.event_id}
            className="bg-white shadow-lg rounded-xl flex-shrink-0 w-80"
          >
            <img
              src={event.image_url}
              alt={event.event_name}
              className="h-60 w-full object-cover rounded-t-xl"
            />
            <div className="p-3 flex flex-col space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {event.event_name}
              </h2>
              <p className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-medium px-2 py-1 rounded-xl inline-block w-fit">
                {event.category}
              </p>
              <p className="text-gray-600 text-sm">{event.date}</p>
              <p className="text-gray-500 text-sm line-clamp-2">
                {event.description}
              </p>
              <button
                onClick={() => handleViewMore(event.event_id)}
                className="text-md font-semibold text-orange-600 text-left hover:underline"
              >
                View More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeEvent;