import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomeEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/events.json") // Adjust path if fetching from an API
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events); // Assuming the JSON has an "events" key
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-white">Loading events...</p>;
  }

  return (
    <div
      className="relative mt-10 mb-10 bg-cover p-5 bg-center lg:p-15"
      style={{ backgroundImage: "url('assests/bg3.png')" }}
    >
      {" "}
      <div className="my-10">
        <h2 className="text-3xl font-bold text-white text-center mb-6 lg:text-4xl">
          Latest Volunteer Events
        </h2>

        {/* Scrollable container */}
        <div className="flex gap-7 overflow-x-auto scrollbar-hide whitespace-nowrap px-3 py-4">
          {events.map((event) => (
            <div
              key={event.event_id}
              className="bg-white shadow-lg rounded-xl  flex-shrink-0 w-80 lg:w-90"
            >
              <img
                src={event.image_url}
                alt={event.event_name}
                className=" h-60 object-cover rounded-t-xl"
              />
              <div className="p-3 flex flex-col space-y-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  {event.event_name}
                </h2>
                <p className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white font-medium px-2 py-1 rounded-xl inline-block w-fit">
                  {event.category}
                </p>
                <p className="text-gray-600 text-sm">{event.date}</p>
                <p className="text-gray-500 text-sm whitespace-normal">
                  {event.description}
                </p>
                <div className="text-md font-semibold text-orange-600">
                  <Link
                    to={`/details/${event.event_id}`}
                    className="view-more-link"
                  >
                    View More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeEvent;
