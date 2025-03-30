import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrganizationDashboard from "./OrganizationDashboard";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/events");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setEvents(data);
        setFilteredEvent(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-white">Error loading events: {error.message}</p>;
  }

  return (
    <OrganizationDashboard>
      <div className="w-full p-4 sm:p-6">
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-semibold text-gray-800 text-center my-4">
            All Events by Your Organization
          </h1>

          {/* Event Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const month = eventDate.toLocaleString("default", { month: "short" });
              const day = eventDate.getDate();
              const formattedDate = eventDate.toLocaleDateString();
              
              return (
                <div
                  key={event.event_id}
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col w-82 h-110 mx-auto"
                >
                  {/* Date Box */}
                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-center rounded-lg px-2 py-1">
                      <span className="block text-sm font-semibold">{month}</span>
                      <span className="block text-lg font-bold">{day}</span>
                    </div>
                  </div>
                  {/* Image with fallback */}
                  <img
                    src={event.image_url || "https://via.placeholder.com/300x150"}
                    alt={event.event_name}
                    className="w-full h-40 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x150";
                    }}
                  />
                  <div className="p-4 flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {event.event_name}
                    </h2>
                    <p className="bg-orange-100 text-orange-500 font-medium px-2 py-1 rounded-xl inline-block w-fit">
                      {event.category}
                    </p>
                    <p className="text-gray-600 text-sm">{event.city}</p>
                    <p className="text-gray-600 text-sm">{formattedDate}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                    <div className="mt-auto pt-4">
                      <Link
                        to={`/details/${event.event_id}`}
                        className="text-md font-semibold text-orange-600 hover:underline"
                      >
                        View More →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </OrganizationDashboard>
  );
};

export default AllEvents;