import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrganizationDashboard from "./OrganizationDashboard";
import { useUser } from "../../hooks/UserContext";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Trash2 } from 'lucide-react';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchOrganizationEvents = async () => {
      try {
        if (!user || user.role !== "organization") {
          throw new Error("Organization not logged in");
        }

        const response = await axios.get(
          "https://pledgeit-backend-ihkh.onrender.com/organization/events",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setEvents(response.data);
      } catch (err) {
        setError(err.message || "Error loading events");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationEvents();
  }, [user]);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`https://pledgeit-backend-ihkh.onrender.com/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'x-org-email': user.email // Add this line
          },
        });
        // Refresh the events list after deletion
        const updatedEvents = events.filter(event => event.event_id !== eventId);
        setEvents(updatedEvents);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event: " + (error.response?.data?.detail || "An error occurred"));
      }
    }
  };

  const formatEventDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString; // fallback if date parsing fails
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading events: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "organization") {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Restricted</h2>
        <p className="text-gray-600 mb-4">
          Please log in as an organization to view events.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <OrganizationDashboard>
      <div className="w-full p-4 sm:p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Your Events
            </h1>
            <Link
              to="/eventform"
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Event
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No events yet</h3>
              <p className="mt-2 text-gray-500">
                Get started by creating your first volunteer event.
              </p>
              <div className="mt-6">
                <Link
                  to="/eventform"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Create Event
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const eventDate = parseISO(event.date);
                const month = format(eventDate, "MMM");
                const day = format(eventDate, "d");
                const formattedDate = format(eventDate, "MMM d, yyyy");

                return (
                  <div
                    key={event.event_id}
                    className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden flex flex-col h-full"
                  >
                    {/* Date Ribbon */}
                    <div className="relative h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={event.image_url || "https://source.unsplash.com/random/600x400/?volunteer"}
                        alt={event.event_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://source.unsplash.com/random/600x400/?volunteer";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-center rounded-lg w-14 p-1">
                        <span className="block text-xs font-semibold uppercase tracking-wide">
                          {month}
                        </span>
                        <span className="block text-xl font-bold leading-none">
                          {day}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {event.event_name}
                          </h2>
                        </div>

                        <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold mb-3">
                          {event.category}
                        </span>

                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.city}
                        </div>

                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formattedDate}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex items-center text-gray-500 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {event.total_registered_volunteers} registered
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            to={`/details/${event.event_id}`}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/OrgEventsUpdate/${event.event_id}`}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteEvent(event.event_id);
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </OrganizationDashboard>
  );
};

export default AllEvents;