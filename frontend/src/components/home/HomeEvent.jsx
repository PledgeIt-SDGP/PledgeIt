import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/UserContext";
import { FiChevronLeft, FiChevronRight, FiClock, FiMapPin } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  if (error) {
    return (
      <div className="my-10 text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Error loading events: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-10">
        <div className="flex gap-7 overflow-x-hidden px-3 py-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-80 lg:w-90">
              <Skeleton height={240} className="rounded-t-xl" />
              <div className="p-3 space-y-3">
                <Skeleton width={180} height={24} />
                <Skeleton width={100} height={20} />
                <Skeleton width={150} height={16} />
                <Skeleton count={2} height={14} />
                <Skeleton width={80} height={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="my-10 text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-600 font-medium">No events available at the moment.</p>
        <p className="text-gray-600 mt-1">Check back later for upcoming events.</p>
      </div>
    );
  }

  return (
    <div className="my-10 relative">
      <div className="relative group">
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Scroll left"
        >
          <FiChevronLeft size={24} />
        </button>

        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scroll-smooth whitespace-nowrap px-6 py-4 scrollbar-hide"
        >
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-white shadow-md hover:shadow-xl rounded-xl flex-shrink-0 w-80 lg:w-96 transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={event.image_url || "https://via.placeholder.com/400x240?text=Event+Image"}
                  alt={event.event_name}
                  className="h-60 w-full object-cover rounded-t-xl"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x240?text=Event+Image";
                  }}
                />
                <span className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {event.category}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {event.event_name}
                </h3>

                <div className="flex items-center text-gray-600 text-sm">
                  <FiClock className="mr-1" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>

                {event.location && (
                  <div className="flex items-center text-gray-600 text-sm">
                    <FiMapPin className="mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}

                <p className="text-gray-500 h-[120px] text-sm whitespace-normal">
                  {event.description}
                </p>

                <button
                  onClick={() => handleViewMore(event.event_id)}
                  className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-between"
                >
                  <span>View Details</span>
                  <FiChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
};

export default HomeEvent;