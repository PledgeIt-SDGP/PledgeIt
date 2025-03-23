import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function EventCards(props) {
  const [noOfElement, setnoOfElement] = useState(6);
  const loadMore = () => {
    setnoOfElement(noOfElement + noOfElement);
  };

  const slice = props.filteredEvent.slice(0, noOfElement);

  if (slice.length === 0) {
    return (
      <div className="text-center text-xl mt-10 text-orange-400">
        <p>Sorry! No events found </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {slice.map((event) => {
          const eventDate = new Date(event.date);
          const month = eventDate.toLocaleString("default", { month: "short" });
          const day = eventDate.getDate();
          return (
            <div
              key={event.id}
              className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col"
            >
              {/* Date Box */}
              <div className="relative">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-center rounded-lg px-3 py-2">
                  <span className="block text-sm font-semibold">{month}</span>
                  <span className="block text-lg font-bold">{day}</span>
                </div>
              </div>

              {/* Image */}
              <img
                src={event.image_url}
                alt={event.event_name}
                className="w-full h-48 object-cover rounded-t-lg"
              />

              {/* Event Details */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">
                  {event.event_name}
                </h2>
                <p className="bg-orange-100 text-orange-500 font-medium px-2 py-1 rounded-xl inline-block w-fit mt-2">
                  {event.category}
                </p>
                <p className="text-gray-600 text-sm mt-2">{event.city}</p>
                <p className="text-gray-600 text-sm">{event.date}</p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                  {event.description}
                </p>

                {/* View More Button at the Bottom */}
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

      {/* Load More Button */}
      {slice.length < props.filteredEvent.length && (
        <div className="flex justify-center mt-10">
          <button
            className="w-40 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white hover:opacity-80 font-medium rounded-2xl text-sm px-5 py-2.5 transition-all"
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}

export default EventCards;