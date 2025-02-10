/* eslint-disable react/prop-types */
import "react-responsive-carousel/lib/styles/carousel.min.css";

const EventPopup = ({ event }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-80">
      <img src={event.image_url} alt={event.event_name} className="rounded-md w-full h-40" />
      <h3 className="text-lg font-semibold mt-2">{event.event_name}</h3>
      <p className="text-gray-600">{event.description}</p>
      <p className="flex items-center text-gray-600 mt-2">📍 {event.city}</p>
      <p className="flex items-center text-gray-600 mt-2">📅 {event.date}</p>
      <p className="flex items-center text-gray-600 mt-2">👥 {event.total_registered_volunteers} / {event.volunteer_requirements}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {event.skills_required.map((skill, index) => (
          <span key={index} className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">{skill}</span>
        ))}
      </div>
      <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600">
        Register Now
      </button>
    </div>
  );
};

export default EventPopup;
