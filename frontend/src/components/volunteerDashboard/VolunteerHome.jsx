import React from "react";
import Footer1 from "../Footer1";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BarChart from "./BarChart";
import VolunteerDashboard from "../../pages/VolunteerDashboard";

function VolunteerHome() {
  const { id } = useParams(); // Get user ID from URL
  const [volunteer, setVolunteer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const response = await fetch("/volunteer.json");
        const data = await response.json();

        const volunteer = data.events.find(
          (e) => e.volunteer_id === parseInt(id)
        );

        if (volunteer) {
          setVolunteer(volunteer.name); // Set only the name
        } else {
          setVolunteer("Unknown Volunteer");
        }
      } catch (error) {
        setVolunteer("Unknown Volunteer");
      }
    };

    fetchVolunteer();
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/events.json"); // Fetch from the JSON file
        const jsonData = await response.json();

        if (!jsonData.events) return;

        // Calculate Active Volunteers
        const activeVolunteers = jsonData.events.reduce(
          (sum, events) => sum + (events.total_registered_volunteers || 0),
          0
        );

        // Calculate Monthly Events
        const currentMonth = new Date().getMonth() + 1;
        const monthlyEvents = jsonData.events.filter(
          (events) => new Date(events.date).getMonth() + 1 === currentMonth
        ).length;

        setStats({ activeVolunteers, monthlyEvents });
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <VolunteerDashboard>
        <div class="grid gap-3 p-4 lg: min-h-screen ">
          <div className="text-gray-800 mt-10">Welcome to PledgeIt !</div>
          <div className=" text-3xl font-bold text-gray-800 ">
            <h1>{volunteer}</h1>
          </div>
          <div class="grid lg:grid-cols-3 gap-4  ">
            <div class="flex items-center justify-between p-10 bg-white/90 backdrop-blur-sm rounded-2xl  shadow-lg cursor-pointer border border-gray-100 lg:p-5 ">
              <div className=" text-gray-800 ">
                <p>Total Events Participated: </p>
                <p className="font-bold text-4xl">0</p>
              </div>

              <div className="bg-orange-100 text-orange-500 rounded-lg p-3">
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
                  class="lucide lucide-calendar-check"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
            </div>
            <div class="flex items-center justify-between p-10 bg-white/90 backdrop-blur-sm rounded-2xl  shadow-lg cursor-pointer border border-gray-100 lg:p-5 ">
              <div className=" text-gray-800 ">
                <p>Total Hours Volunteered</p>
                <p className="font-bold text-4xl">0</p>
              </div>
              <div className="bg-red-100 text-red-500 rounded-lg p-3">
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
                  class="lucide lucide-clock"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div class="flex items-center justify-between  bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 backdrop-blur-sm rounded-2xl p-10 shadow-lg cursor-pointer border border-gray-100 lg:p-5 ">
              <div className=" text-white ">
                <p>
                  Register & Join for
                  <br /> events to level up!
                </p>
                <button className="mt-3">
                  <a
                    href="/event"
                    className="w-34 flex items-center justify-center gap-2 bg-white/40 text-white hover:bg-white/20 hover:text-white font-medium rounded-xl text-sm px-5 py-2.5"
                  >
                    Join Event
                  </a>
                </button>
              </div>
              <img
                src="assests/levelUp.svg"
                alt="volunteer"
                className="w-34 h-32"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 lg:mt-0 lg:grid-cols-2 ">
            <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100">
              Volunteer Stats
              <BarChart />
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 overflow-y-auto h-96 overflow-x-hidden">
              <div className="text-gray-800 mt-2">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 mt-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100"
                    >
                      <h4 className="text-md font-medium">{event.name}</h4>
                      <p className="text-gray-600 text-sm">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer1 />
      </VolunteerDashboard>
    </>
  );
}
export default VolunteerHome;
