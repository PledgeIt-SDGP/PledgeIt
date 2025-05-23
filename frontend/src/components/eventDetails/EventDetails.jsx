import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer1 from "../Footer1";
import { useUser } from "../../hooks/UserContext"; // Import the user context

const EventDetails = () => {
  const { id } = useParams(); // Get the event_id from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const { user } = useUser(); // Get the current user from context
  const [isRegistered, setIsRegistered] = useState(false);

  // Fetch event data from the backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://pledgeit-backend-ihkh.onrender.com/events/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvent(data);

        // Check if the user is already registered
        if (user && data.registered_volunteers && data.registered_volunteers.includes(user.id)) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      window.location.href = `/login?redirect=/details/${id}`;
      return;
    }

    setRegistering(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://pledgeit-backend-ihkh.onrender.com/events/${id}/join`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
  });

  const data = await response.json();

  if (!response.ok) {
    setRegisterError(data.detail || "Failed to register for the event");
  } else {
    setRegisterSuccess("Successfully registered for the event!");
    setIsRegistered(true); // Update registration status
    alert("You have successfully registered for the event!");
  }
} catch (error) {
  setRegisterError("An error occurred while registering");
  console.error("Registration error:", error);
} finally {
  setRegistering(false);
}
  };

if (!event) return <p className="text-center text-red-500">Event not found!</p>;

const eventDate = new Date(event.date);
const month = eventDate.toLocaleString("default", { month: "short" });
const day = eventDate.getDate();


return (
  <>
    <div className="container p-6 bg-orange-100/40">
      <div className="flex flex-col-reverse mt-12 md:flex md:flex-col-reverse md:mt-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:mt-5">
        {/* Left Sidebar */}
        <div className="bg-white mt-15 rounded-lg md:col-span-1 p-5 lg:mt-0">
          <h2 className="text-lg font-bold mb-2">Event Details</h2>
          <p className="text-black">Duration: {event.duration} hours</p>
          <p className="text-black mt-4">
            Skills Required:{" "}
            <p className="text-gray-600 ">
              {event.skills_required.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </p>
          </p>

          {/* Contact Information */}
          <div className="mt-4">
            <p className="flex flex-row gap-3 pb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="gray"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href={`tel:${event.contact_person.contact_number}`}>
                {event.contact_person.contact_number}
              </a>
              <p>({event.contact_person.name})</p>

            </p>
            <p className="flex flex-row gap-3 pb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <a
                href={`mailto:${event.contact_email}`}
                className="text-black-500"
              >
                {event.contact_email}
              </a>
            </p>
          </div>

          {/* Location */}
          <div className="mt-4">
            <h3 className="text-md font-bold">📍 Location</h3>
            <p>{event.address}</p>
            <iframe
              className="w-full h-70 rounded-lg mt-2"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                event.address
              )}&output=embed`}
              allowFullScreen
              title="Event Location"
            ></iframe>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
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
            <div className="bg-gradient-to-r from-red-400 to-orange-500 p-4 rounded-lg text-white">
              <h1 className="text-2xl font-bold">{event.event_name}</h1>
              <p className="text-lg">Organized by: {event.organization}</p>
            </div>

            <p className="text-gray-600 pt-5">{event.description}</p>

            <div className="mt-4">
              <p className="text-md font-semibold flex flex-row gap-2">
                <strong>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-calendar-heart"
                  >
                    <path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z" />
                  </svg>
                </strong>
                {event.date}
              </p>
              <p className="flex flex-row gap-2 text-md font-semibold pt-3">
                <strong>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-timer"
                  >
                    <line x1="10" x2="14" y1="2" y2="2" />
                    <line x1="12" x2="15" y1="14" y2="11" />
                    <circle cx="12" cy="14" r="8" />
                  </svg>
                </strong>
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-siren"
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
                Register before: {event.registration_deadline}
              </p>

              <p>
                <strong>👥 Volunteers Needed:</strong>{" "}
                {event.volunteer_requirements}
              </p>
              <p>
                <strong>👥 Additional Details:</strong>{" "}
                {event.additional_notes}
              </p>
            </div>
            <div className="mt-4">
              {registerError && (
                <p className="text-red-500 mb-2">{registerError}</p>
              )}
              {registerSuccess && (
                <p className="text-green-500 mb-2">{registerSuccess}</p>
              )}
              <button
                onClick={handleRegister}
                disabled={registering}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {registering ? "Registering..." : "Register for the event"}
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