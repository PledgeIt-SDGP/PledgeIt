import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

function EventCards(props) {
  const [noOfElement, setnoOfElement] = useState(8);
  const loadMore = () => {
    setnoOfElement(noOfElement + noOfElement);
  };

  const slice = props.filteredEvent.slice(0, noOfElement);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-6">
        {slice.map((event) => (
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
      <div
        className="w-40 flex items-center justify-center m-auto mt-10 gap-2  bg-orange-500 text-white  hover:opacity-70 hover:cursor-pointer font-medium rounded-2xl text-sm px-5 py-2.5"
        onClick={() => loadMore()}
      >
        Load More
      </div>
    </>
  );
}

export default EventCards;
