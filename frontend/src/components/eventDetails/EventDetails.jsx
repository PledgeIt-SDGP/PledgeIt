import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer1 from "../Footer1";
import VolunteerDashboard from "../../pages/vol/VolunteerDashboard";

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
      <div className="container p-6 bg-orange-100/40 ">
        <div className="flex flex-col-reverse mt-12 md:flex md:flex-col-reverse md:mt-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-5">
          {/* Left Sidebar */}
          <div className=" bg-white mt-15 rounded-lg md:col-span-1 p-5 lg:mt-0">
            <h2 className="text-lg font-bold mb-2">Event Details</h2>
            <p className="text-gray-600">Duration: {event.duration}</p>
            <p className="text-gray-600">
              Volunteers Needed: {event.volunteer_requirements}
            </p>

            {/* Contact Details */}
            <div className="mt-4">
              <p className="flex flex-row gap-3 pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="gray"
                  stroke="ray"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-phone"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>{" "}
                {event.contact_number}
              </p>
              <p className="flex flex-row gap-3 pb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-mail"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>{" "}
                <a
                  href={`mailto:${event.contact_email}`}
                  className="black-500"
                >
                  {event.contact_email}
                </a>
              </p>
              <p className="flex flex-row gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="gray"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-link"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>{" "}
                <a
                  href={event.website}
                  className="text-black-500"
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
          <div className="bg-white shadow-lg rounded-lg p-6  md:col-span-2 ">
            <div className="relative w-full h-60 bg-cover bg-center rounded-lg">
              <img
                src={event.image_url}
                alt={event.event_name}
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Date Box */}
              <div className="absolute top-2 right-2 bg-black/60 text-white text-center text-bold rounded-lg px-2 py-1">
                <span className="block text-lg font-semibold">{month}</span>
                <span className="block text-lg font-bold">{day}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-orange-500 p-4 rounded-lg text-white">
                <h1 className="text-2xl font-bold">{event.event_name}</h1>
                <p className="text-lg">Organized by: {event.organizer}</p>
              </div>

              <p className="text-gray-600 pt-5">{event.description}</p>

              <div className="mt-4">
                <p className="text-md font-semibold flex flex-row gap-2">
                  <strong>
                    <svg
                      xmlns="http://www.w3.org/2000/svg  "
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-calendar-heart"
                    >
                      <path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z" />
                    </svg>
                  </strong>{" "}
                  {event.date}
                </p>
                <p className="flex flex-row gap-2 text-md font-semibold pt-3 ">
                  <strong>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-timer"
                    >
                      <line x1="10" x2="14" y1="2" y2="2" />
                      <line x1="12" x2="15" y1="14" y2="11" />
                      <circle cx="12" cy="14" r="8" />
                    </svg>
                  </strong>{" "}
                  {event.time}
                </p>
                <p className="text-md font-semibold flex flex-row gap-2 pt-3 pb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-siren"
                  >
                    <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
                    <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
                    <path d="M21 12h1" />
                    <path d="M18.5 4.5 18 5" />
                    <path d="M2 12h1" />
                    <path d="M12 2v1" />
                    <path d="m4.929 4.929.707.707" />
                    <path d="M12 12v6" />
                  </svg>
                  Register before: {event.date}
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
                    (window.location.href = "/details/" + event.event_id)
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
      <Footer1 />
    </>
  );
};

export default EventDetails;
