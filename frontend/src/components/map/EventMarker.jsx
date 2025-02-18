import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventMarker = ({ event }) => {
  const coordinates = [event.latitude, event.longitude];

  return (
    <Marker
      position={coordinates}
      icon={
        new Icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
          iconSize: [22, 36], // Adjusted for better visibility
          iconAnchor: [12, 36],
          popupAnchor: [1, -30],
        })
      }
    >
      <Popup className="w-64 bg-white rounded-lg shadow-md p-4 border border-gray-200">
        {/* Floating Category Tag */}
        <div className="absolute -top-3 left-3 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full shadow-sm">
          {event.category}
        </div>

        <div className="flex flex-col space-y-2">
          {/* Event Title */}
          <h3 className="text-base font-bold text-gray-900">{event.event_name}</h3>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
            <span>{event.city}</span>
          </div>

          {/* Date */}
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-4 h-4 mr-1 text-gray-500" />
            <span>{event.date} at {event.time}</span>
          </div>

          {/* Total Volunteers */}
          <div className="flex items-center text-xs text-gray-600">
            <Users className="w-4 h-4 mr-1 text-gray-500" />
            <span>{event.total_registered_volunteers} Volunteers Registered</span>
          </div>

          {/* Event Description - Limited Text */}
          <p className="text-xs text-gray-700 leading-tight line-clamp-2">
            {event.description}
          </p>

          {/* "View More" Link (Always Red) */}
          <Link
            to={`/events/${event.event_id}`}
            className="flex items-center text-red-600 font-semibold text-sm transition-all group"
          >
            <span className="mr-1 group-hover:text-red-700 transition-colors">View More</span>
            <ArrowRight className="w-4 h-4 text-red-600 group-hover:text-red-700 transition duration-300 ease-in-out transform group-hover:translate-x-1"/>
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

export default EventMarker;
