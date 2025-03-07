import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer1 from "../Footer1";
import VolunteerDashboard from "../../pages/VolunteerDashboard";

const EventDetails = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/events.json")
      .then((response) => response.json())
      .then((data) => {
        const foundEvent = data.events.find((e) => e.event_id === parseInt(id));
        setEvent(foundEvent);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading event data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event)
    return <p className="text-center text-red-500">Event not found!</p>;

  // Extract month and day from event date
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString("default", { month: "short" });
  const day = eventDate.getDate();

  return (
    <>
      <VolunteerDashboard>
        <div className="container p-6 ">
          <div className="flex flex-col-reverse md:grid md:grid-cols-3 lg:gap-6">
            {/* Left Sidebar */}
            <div className=" bg-white mt-15 rounded-lg md:col-span-1 lg:mt-0">
              <h2 className="text-lg font-bold mb-2">Event Details</h2>
              <p className="text-gray-600">{event.event_name}</p>
              <p className="text-sm text-gray-500">
                {event.date} at {event.time}
              </p>

              {/* Contact Details */}
              <div className="mt-4">
                <p>📞 {event.contact_number}</p>
                <p>
                  📧{" "}
                  <a
                    href={`mailto:${event.contact_email}`}
                    className="text-blue-500"
                  >
                    {event.contact_email}
                  </a>
                </p>
                <p>
                  🔗{" "}
                  <a
                    href={event.website}
                    className="text-blue-500"
                    target="_blank"
                  >
                    Event Website
                  </a>
                </p>
              </div>

              {/* Location */}
              <div className="mt-4">
                <h3 className="text-md font-bold">📍 Location</h3>
                <p>{event.location}</p>
                <iframe
                  className="w-full h-70 rounded-lg mt-2"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    event.location
                  )}&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white shadow-lg rounded-lg p-6  md:col-span-2 mr-20 ">
              <div className="relative w-full h-60 bg-cover bg-center rounded-lg">
                <img
                  src={event.image_url}
                  alt={event.event_name}
                  className="w-full h-full object-cover rounded-lg"
                />
                {/* Date Box */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-center rounded-lg px-2 py-1">
                  <span className="block text-sm font-semibold">{month}</span>
                  <span className="block text-lg font-bold">{day}</span>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-2xl font-bold">{event.event_name}</h1>
                <p className="text-lg">{event.organizer}</p>
                <p className="text-gray-600">{event.description}</p>

                <div className="mt-4">
                  <p>
                    <strong>⏳ Duration:</strong> {event.duration}
                  </p>
                  <p>
                    <strong>👥 Volunteers Needed:</strong>{" "}
                    {event.volunteer_requirements}
                  </p>
                  <p>
                    <strong>👥 Additional Details:</strong> is simply dummy text
                    of the printing and typesetting industry. Lorem Ipsum has
                    been the industry's standard dummy text ever since the
                    1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book. It has survived
                    not only five centuries, but also the leap into electronic
                    typesetting, remaining essentially unchanged. It was
                    popularised in the 1960s with the release of Letraset sheets
                    containing Lorem Ipsum passages, and more recently with
                    desktop publishing software like Aldus PageMaker including
                    versions of Lorem Ipsum.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      (window.location.href = "/volunteerDashboard")
                    }
                    className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white px-4 py-2 rounded-lg "
                  >
                    Register for the event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VolunteerDashboard>
      <Footer1 />
    </>
  );
};

export default EventDetails;
