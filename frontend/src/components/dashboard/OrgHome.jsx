import React, { useState, useEffect } from "react";
import { Calendar, Clock, HeartHandshake, Plus, Target, Star } from "lucide-react";
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
    name: "bla organization",
  });

  const [stats, setStats] = useState({
    totalEvents: 0,
    totVolunteerHours: 0,
  });

  const [causesSupportData, setCausesSupportData] = useState([]);

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      icon: Star,
      color: "yellow",
      text: "Milestone Reached: 5000 Community Members Impacted",
      time: "Just now"
    },
    {
      id: 2,
      icon: HeartHandshake,
      color: "green",
      text: "New Partnership with Local Tech Educators",
      time: "2 days ago"
    },
    {
      id: 3,
      icon: Target,
      color: "blue",
      text: "Successful Digital Literacy Workshop Completed",
      time: "5 days ago"
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
          totalEvents: 10, // Mock value
          totVolunteerHours: 120, // Mock value
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

    fetchStats();
    fetchCausesStats();
  }, []);

return (
  <OrganizationDashboard>
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center sm:mt-0 mt-8">
        <div>
          <p className="text-md">Welcome to PledgeIt</p>
          <h1 className="text-3xl font-bold text-gray-800">
            Hi, {organization.name}!
          </h1>
        </div>
        <span className="flex items-center font-semibold">
          <Calendar className="mr-2" />
          Today: {currentDate}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Events Completed */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex items-center">
          <div className="bg-orange-100 p-3 rounded-xl mr-8">
            <Calendar size={30} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-gray-600 text-md font-semibold">
              Events Completed
            </h3>
            <p className="text-4xl font-bold mt-1">
              {loading ? "..." : stats.totalEvents}
            </p>
          </div>
        </div>

        {/* Total organization Hours */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-xl mr-8">
            <Clock size={30} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-gray-600 text-md font-semibold">
              Total organization Hours
            </h3>
            <p className="text-4xl font-bold mt-1">
              {loading ? "..." : stats.totVolunteerHours}
            </p>
          </div>
        </div>

        {/* Create Event */}
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg shadow-red-300 transition-all flex items-center p-5 ">
          <div>
            <h3 className="text-md font-semibold">
             Ready to create your event? Start creating your event now
            </h3>
            <a
              href="/eventForm"
              className="inline-flex items-center mt-3 px-4 py-2 bg-white text-orange-600 rounded-lg font-bold shadow hover:bg-gray-100"
            >
              <Plus className="mr-1" /> Create Event
            </a>
          </div>
          <img
            src="createEvent.png"
            alt="Event"
            className="w-28 ml-auto hidden sm:block"
            loading="lazy"
          />
        </div>
      </div>

      {/* Insights */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 ">

        <div className="bg-gray-50 shadow rounded-lg p-6 ">
          <h2 className="text-lg font-semibold text-gray-800">
            Causes by Category
          </h2>
          <div className="mt-6">
            <CausesChart causesData={causesSupportData} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800">
            Top Volunteers of {organization.name}
          </h2>
          <div><TopVolunteers/></div>
            
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h2>
        </div>
        <div className="p-6 space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`bg-${activity.color}-100 p-2 rounded-full mr-3`}>
                <activity.icon className={`text-${activity.color}-500 w-5 h-5`} />
              </div>
              <div>
                <p className="text-sm text-gray-800">{activity.text}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </OrganizationDashboard>
);
};

export default OrgHome;