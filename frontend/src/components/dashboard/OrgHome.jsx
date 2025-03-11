import React, { useState, useEffect } from "react";
import { Calendar, Clock, HeartHandshake, Plus, Target, Star, BarChart3, Zap, Award, PieChart, TrendingUp } from "lucide-react";
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
    name: "Bla bla",
    logo: "background.jpg"
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
      }
    };

    fetchStats();
    fetchCausesStats();
    fetchUpcomingEvents();

  }, []);



  return (
    <OrganizationDashboard>
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 min-h-screen">
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 ">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <div className="border-1 border-gray-500 rounded-full mr-4">
                  <img
                    src={organization.logo || "/api/placeholder/64/64"}
                    alt="Organization Logo"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="bg-red-500 text-gray-100 text-xs font-bold px-2 py-1 rounded-full mr-2">
                      DASHBOARD
                    </div>
                    <div className="text-sm text-gray-500">Welcome to PledgeIt</div>
                  </div>
                  <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                    Hi, {organization.name}!
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-rose-50 p-3 rounded-xl flex items-center">
                  <Calendar className="mr-2 text-gray-700" />
                  <span className="font-medium text-gray-700">{currentDate}</span>
                </div>
                <a
                  href="/eventForm"
                  className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <Plus className="mr-2" /> Create Event
                </a>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {/* Events Completed */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center transform hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl mr-6">
                <Calendar size={32} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Events Completed
                </p>
                <div className="flex items-baseline">
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {loading ? "..." : stats.totalEvents}
                  </p>

                </div>
              </div>
            </div>

            {/* Total Volunteer Hours */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center transform hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl mr-6">
                <Clock size={32} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Volunteer Hours
                </p>
                <div className="flex items-baseline">
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {loading ? "..." : stats.totVolunteerHours}
                  </p>

                </div>
              </div>
            </div>

            {/* People Impacted */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center transform hover:-translate-y-1 duration-300">
              <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-2xl mr-6">
                <HeartHandshake size={32} className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Community Engagement
                </p>
                <div className="flex items-baseline">
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {loading ? "..." : stats.peopleImpacted}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Event Promotion & Upcoming Events */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Create Event Promotion */}
            <div className="bg-white shadow-lg rounded-2xl p-6 overflow-y-auto max-h-130">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <PieChart size={20} className="mr-2 text-orange-500" />
                  Impact Sectors
                </h2>
              </div>
              <div className="mt-2">
                <CausesChart causesData={causesSupportData} />
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6 overflow-y-hidden max-h-130">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Calendar size={20} className="mr-2 text-orange-500" />
                  Upcoming Volunteer Events
                </h2>

              </div>

              <div className="space-y-4 overflow-y-auto max-h-96">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors ">
                    <h3 className="font-semibold text-gray-800">{event.title}</h3>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <HeartHandshake size={14} className="mr-1" />
                        <span>{event.registeredVolunteers}/{event.expectedVolunteers} volunteers</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 flex items-center">
                      <Target size={14} className="mr-1" />
                      <span>{event.venue + " " + event.city}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="/eventForm"
                className="block text-center px-4 py-3 border border-dashed border-orange-300 rounded-xl text-orange-600 font-medium hover:bg-orange-50 transition-colors"
              >
                + Schedule New Event
              </a>

            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">


            <div className="bg-white shadow-lg rounded-2xl p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <BarChart3 size={20} className="mr-2 text-orange-500" />
                  Top Performing Volunteers
                </h2>
              </div>
              <div className="mt-2">
                <TopVolunteers />
              </div>
            </div>
          </div>

        </div>
      </div>
    </OrganizationDashboard>
  );
};

export default OrgHome;