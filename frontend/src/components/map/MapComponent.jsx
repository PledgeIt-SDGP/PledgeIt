import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { fetchEvents } from "../../api/eventApi";
import EventPopup from "./EventPopUp";

const MapComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, []);

  return (
    <MapContainer center={[7.8731, 80.7718]} zoom={7.5} className="h-[600px] w-full rounded-lg shadow-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {events.map((event, index) => (
        <Marker key={index} position={[event.latitude, event.longitude]}>
          <Popup>
            <EventPopup event={event} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
