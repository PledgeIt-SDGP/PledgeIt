import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { MapPin, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const EventMarker = ({ event }) => {
  const coordinates = [event.latitude, event.longitude];

  return (
    <Marker
      position={coordinates}
      icon={
        new Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          iconSize: [26, 40],
          iconAnchor: [13, 40],
          popupAnchor: [1, -34],
        })
      }
    >
      <Popup className="relative w-64 sm:w-72 md:w-80 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-200">
        {/* Floating Category Tag */}
        <div className="absolute -top-3 left-3 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-red-500 to-red-700 text-white rounded-full shadow-sm">
          {event.category}
        </div>
        <div className="flex flex-col space-y-2">
          {/* Event Title */}
          <h3 className="text-base font-bold text-gray-900">{event.event_name}</h3>

          {/* Location */}
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-red-500" strokeWidth={1.5} />
            <span>{event.city}</span>
          </div>

          {/* Date */}
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-4 h-4 mr-1 text-red-500" strokeWidth={1.5} />
            <span>
              {event.date} at {event.time}
            </span>
          </div>

          {/* Total Volunteers */}
          <div className="flex items-center text-xs text-gray-600">
            <Users className="w-4 h-4 mr-1 text-red-500" strokeWidth={1.5} />
            <span>{event.total_registered_volunteers} Volunteers Registered</span>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-700 leading-tight line-clamp-2">
            {event.description}
          </p>

          {/* "View More" Link */}
          <Link
            to={`/events/${event.event_id}`}
            className="flex items-center justify-center bg-gradient-to-r from-red-500 to-red-700 font-semibold text-sm transition-all group px-2 py-1 rounded"
          >
            <span className="text-white group-hover:text-white transition-colors">
              View More
            </span>
          </Link>
        </div>
      </Popup>
    </Marker>
  );
};

export default EventMarker;