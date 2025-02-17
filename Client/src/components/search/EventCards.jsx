import React from "react";
import { Link } from "react-router-dom";

function EventCards(props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-6">
      {props.filteredEvent.map((event) => (
        <div
          key={event.id}
          className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden flex flex-col w-72 h-110 mx-auto"
        >
          <img
            src={event.image_url}
            alt={event.event_name}
            className="w-full h-40 object-cover"
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
            <div className="text-md font-semibold text-orange-600">
              <Link to={`/event_details`} className="view-more-link">
                View More →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventCards;
