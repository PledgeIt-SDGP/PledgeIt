import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  HeartHandshake,
  Plus,
  Target,
  PieChart,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  Smile
} from "lucide-react";
import OrganizationDashboard from "../../pages/OrganizationDashboard";
import CausesChart from "./CausesChart";
import TopVolunteers from "./TopVolunteers";

const OrgHome = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState({
    name: "Volunteer Sri Lanka",
    logo: "logo.png"
  });

  const [stats, setStats] = useState({
    totalEvents: 0,
    totVolunteerHours: 0,
    peopleImpacted: 0
  });

  const [causesSupportData, setCausesSupportData] = useState([]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Beach Cleanup Drive",
      date: "March 15, 2025",
      registeredVolunteers: 24,
      expectedVolunteers: 30,
      venue: "Sunset Beach",
      city: "Colombo"
    },
    {
      id: 2,
      title: "Park Restoration",
      date: "March 18, 2025",
      registeredVolunteers: 22,
      expectedVolunteers: 40,
      venue: "Central Park",
      city: "Kandy"
    },
    {
      id: 3,
      title: "Food Drive",
      date: "March 20, 2025",
      registeredVolunteers: 14,
      expectedVolunteers: 34,
      venue: "Community Hall",
      city: "Galle"
    },
    {
      id: 4,
      title: "Tech Skills Workshop",
      date: "March 22, 2025",
      registeredVolunteers: 18,
      expectedVolunteers: 34,
      venue: "Community Center",
      city: "Colombo"
    }
  ]);

  // Mock data for causes
  const mockCausesData = [
    { name: 'Environmental', value: 4 },
    { name: 'Community Service', value: 3 },
    { name: 'Education', value: 2 },
    { name: 'Healthcare', value: 0 },
    { name: 'Animal Welfare', value: 3 },
    { name: 'Disaster Relief', value: 2 },
    { name: 'Lifestyle & Culture', value: 1 },
    { name: 'Fundraising & Charity', value: 0 }
  ];

  useEffect(() => {
    // Simulate fetching stats (mock data)
    const fetchStats = () => {
      setTimeout(() => {
        setStats({
          totalEvents: 15,
          totVolunteerHours: 120,
          peopleImpacted: 1240
        });
        setLoading(false);
      }, 1000);
    };

    // Simulate fetching causes data (mock data)
    const fetchCausesStats = () => {
      setTimeout(() => {
        setCausesSupportData(mockCausesData);
      }, 500);
    };

    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch("/api/events/upcoming");
        const data = await response.json();
        setUpcomingEvents(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        // Keep using mock data on error
      }
    };

    fetchStats();
    fetchCausesStats();
    fetchUpcomingEvents();
  }, []);

  const getProgressColor = (registered, expected) => {
    const percentage = (registered / expected) * 100;
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };



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
                    src={organization.logo || "https://img.freepik.com/free-vector/multicultural-concept-illustration_114360-25402.jpg"}
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
                    Hi, {organization.name}!
                  </h1>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
                <div className="bg-rose-50 p-2 sm:p-3 rounded-xl flex items-center justify-center shadow-sm w-full">
                  <Calendar className="mr-2 text-red-600" size={16} />
                  <span className="font-medium text-gray-700 text-sm">{currentDate}</span>
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
                <div className="flex items-baseline">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ">
                    {loading ? "..." : stats.totalEvents}
                  </p>
                </div>
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
                <div className="flex items-baseline">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ">
                    {loading ? "..." : stats.totVolunteerHours}
                  </p>
                </div>
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
                <div className="flex items-baseline">
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ">
                    {loading ? "..." : stats.peopleImpacted}
                  </p>
                </div>
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
                  <CausesChart causesData={causesSupportData} />
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

            <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-64 sm:max-h-80 md:max-h-96 pr-1">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 sm:p-4 border border-gray-100 rounded-lg sm:rounded-xl hover:border-red-200 hover:bg-red-50 transition-all transform hover:-translate-y-1 hover:shadow-sm"
                >
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{event.title}</h3>
                  <div className="mt-2 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center mb-1 sm:mb-0">
                      <Calendar size={12} className="mr-1 text-orange-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <HeartHandshake size={12} className="mr-1 text-orange-500" />
                      <span>{event.registeredVolunteers}/{event.expectedVolunteers}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-gray-500 flex items-center">
                    <Target size={12} className="mr-1 text-orange-500" />
                    <span className="truncate">{event.venue}, {event.city}</span>
                  </div>
                  <div className="mt-2 sm:mt-3 w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getProgressColor(event.registeredVolunteers, event.expectedVolunteers)}`}
                      style={{ width: `${(event.registeredVolunteers / event.expectedVolunteers) * 100}%` }}
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
          </div>
        </div>
      </div>
    </OrganizationDashboard>
  );
};

export default OrgHome;