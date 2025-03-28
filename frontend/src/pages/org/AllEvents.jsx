import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrganizationDashboard from "./OrganizationDashboard";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch events created by the current organization
    const fetchOrganizationEvents = async () => {
      try {
        const response = await fetch("/organization/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include the organization's authentication token
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data); // Assuming the API returns an array of events
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchOrganizationEvents();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading events...</p>;
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
              return (
                <div
                  key={event.event_id} // Use event_id instead of id
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col w-82 h-110 mx-auto"
                >
                  {/* Date Box */}
                  <div className="relative">
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-center rounded-lg px-2 py-1">
                      <span className="block text-sm font-semibold">{month}</span>
                      <span className="block text-lg font-bold">{day}</span>
                    </div>
                  </div>
                  {/* Image */}
                  <img
                    src={event.image_url}
                    alt={event.event_name}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4 flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {event.event_name}
                    </h2>
                    <p className="bg-orange-100 text-orange-500 font-medium px-2 py-1 rounded-xl inline-block w-fit">
                      {event.category}
                    </p>
                    <p className="text-gray-600 text-sm">{event.city}</p>
                    <p className="text-gray-600 text-sm">{event.date}</p>
                    <p className="text-gray-500 text-sm">{event.description}</p>
                    <div className="text-sm font-semibold text-orange-700 bg-red-50 px-2 py-1 my-2 rounded-lg w-fit">
                      <Link to={`/edit-event/${event.event_id}`} className="view-more-link">
                        Edit Event Details →
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