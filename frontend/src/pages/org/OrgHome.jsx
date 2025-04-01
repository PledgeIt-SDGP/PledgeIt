import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  HeartHandshake,
  Plus,
  Target,
  PieChart,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import OrganizationDashboard from "./OrganizationDashboard";
import CausesChart from "../../components/org-dash/CausesChart";
import TopVolunteers from "../../components/org-dash/TopVolunteers";
import { useUser } from "../../hooks/UserContext";
import axios from "axios";

const OrgHome = () => {
  const { user } = useUser(); // Access the user object from UserContext
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the user object to populate the organization details
  const organization = {
    name: user?.name || "Organization Name",
    logo: user?.logo || "default-logo.png", // Default logo if none is provided
    eventsCompleted: user?.events_completed || 0,
    volunteerHours: user?.volunteer_hours || 0,
    communityImpact: user?.community_impact || 0,
    causesSupported: user?.causes_supported || ["Default Cause 1", "Default Cause 2"],
  };

  useEffect(() => {
    const fetchOrganizationEvents = async () => {
      try {
        if (!user || user.role !== "organization") {
          return;
        }

        const response = await axios.get(
          "http://127.0.0.1:8000/organization/events",
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

  // Use either the API events or user events if API fails
  const displayEvents = events.length > 0 ? events : user?.events || [];

  return (
    <OrganizationDashboard>
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-6 transition-shadow hover:shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                <div className="relative mb-3 sm:mb-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-300 rounded-full opacity-20 animate-pulse"></div>
                  <img
                    src={organization.logo}
                    alt="Organization Logo"
                    className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md relative z-10"
                  />
                </div>
                <div className="sm:ml-4">
                  <div className="flex flex-col sm:flex-row items-center mb-1 justify-center sm:justify-start">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-1 sm:mb-0 sm:mr-2">
                      DASHBOARD
                    </div>
                    <div className="text-sm text-gray-500">Welcome to PledgeIt</div>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    Hi, {organization.name}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <div className="bg-rose-50 p-2 sm:p-3 rounded-xl flex items-center justify-center shadow-sm w-full">
                  <Calendar className="mr-2 text-red-600" size={16} />
                  <span className="font-medium text-gray-700 text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <a
                  href="/eventForm"
                  className="inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all w-full"
                >
                  <Plus className="mr-1 sm:mr-2" size={16} /> Create Event
                </a>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3">
            {/* Events Completed */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 flex items-center transform hover:-translate-y-1 duration-300 group">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 sm:p-4 rounded-xl md:rounded-2xl mr-4 sm:mr-6 group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                <Calendar size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Events Completed
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  {organization.eventsCompleted}
                </p>
              </div>
            </div>

            {/* Total Volunteer Hours */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 flex items-center transform hover:-translate-y-1 duration-300 group">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 sm:p-4 rounded-xl md:rounded-2xl mr-4 sm:mr-6 group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                <Clock size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Volunteer Hours
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  {organization.volunteerHours}
                </p>
              </div>
            </div>

            {/* People Impacted */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 flex items-center transform hover:-translate-y-1 duration-300 group">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 sm:p-4 rounded-xl md:rounded-2xl mr-4 sm:mr-6 group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                <HeartHandshake size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Community Impact
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                  {organization.communityImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Middle Section: Impact Sectors & Top Volunteers */}
          <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Impact Sectors */}
          
          <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl md:rounded-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                <PieChart size={18} className="mr-2 text-orange-500" />
                Impact Sectors
              </h2>
            </div>
            <div className="mt-2 overflow-hidden">
              <div className="h-48 sm:h-64 md:h-72">
                {organization.causesSupported && organization.causesSupported.length > 0 ? (
                  <CausesChart causesData={organization.causesSupported} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No causes supported yet</p>
                  </div>
                )}
              </div>
              {/* Add a simple list view of causes below the chart */}
              <div className="mt-4 flex flex-wrap gap-2">
                {organization.causesSupported && organization.causesSupported.map((cause, index) => (
                  <span
                    key={index}
                    className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                  >
                    {cause}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Volunteers Section */}
          <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl md:rounded-2xl p-4 sm:p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 size={18} className="mr-2 text-orange-500" />
                Top Volunteers
              </h2>
            </div>
            <div className="mt-2">
              <TopVolunteers />
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
              <Calendar size={18} className="mr-2 text-orange-500" />
              Upcoming Events
            </h2>
            <a href="/orgevents" className="text-orange-500 text-xs sm:text-sm font-medium hover:text-orange-700 flex items-center">
              View All <ChevronRight size={16} />
            </a>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              Error loading events: {error.message}
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-64 sm:max-h-80 md:max-h-96 pr-1">
                {displayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 sm:p-4 border border-gray-100 rounded-lg sm:rounded-xl hover:border-red-200 hover:bg-red-50 transition-all transform hover:-translate-y-1 hover:shadow-sm"
                  >
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{event.event_name}</h3>
                    <div className="mt-2 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center mb-1 sm:mb-0">
                        <Calendar size={12} className="mr-1 text-orange-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <HeartHandshake size={12} className="mr-1 text-orange-500" />
                        <span>{event.total_registered_volunteers || 0}/{event.volunteer_requirements || 0}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs sm:text-sm text-gray-500 flex items-center">
                      <Target size={12} className="mr-1 text-orange-500" />
                      <span className="truncate">{event.venue}, {event.city}</span>
                    </div>
                    <div className="mt-2 sm:mt-3 w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-green-500`}
                        style={{ width: `50%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/eventForm"
                className="block text-center mt-3 sm:mt-4 px-3 py-2 sm:px-4 sm:py-3 border border-dashed border-orange-300 rounded-lg sm:rounded-xl text-orange-600 text-sm font-medium hover:bg-orange-50 transition-colors"
              >
                <Plus size={14} className="inline mr-1" /> Schedule New Event
              </a>
            </>
          )}
        </div>
      </div>
    </div>
    </OrganizationDashboard >
  );
};

export default OrgHome;