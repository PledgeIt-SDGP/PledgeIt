import React from "react";
import Footer1 from "../Footer1";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BarChart from "./AreaBaseLine";
import VolunteerDashboard from "../../pages/VolunteerDashboard";
import PieAnimation from "./PieAnimation";
import HomeEvent from "../home/HomeEvent";
import DailyQuotes from "./DailyQuotes";

function VolunteerHome() {
  const { id } = useParams(); // Get user ID from URL
  const [volunteers, setVolunteers] = useState([]); // Store all volunteers
  const [volunteer, setVolunteer] = useState(null); // Store single volunteer
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch("/volunteers.json");
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        // Flatten the volunteers list from all events
        const allVolunteers = data.flatMap((event) =>
          event.volunteers.map((v) => ({ ...v, event_id: event.event_id }))
        );
        setVolunteers(allVolunteers);

        // Find specific volunteer by ID
        const foundVolunteer = allVolunteers.find(
          (v, index) => index === parseInt(id)
        );
        setVolunteer(
          foundVolunteer || { first_name: "Volunteer", last_name: "Volunteer" }
        );
      } catch (error) {
        console.error("Error fetching volunteer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, [id]);

  return (
    <>
      <VolunteerDashboard>
        <div className="grid gap-3 p-4 lg: min-h-screen ">
          <div className=" text-3xl font-bold text-gray-800 mb-4 ">
            {/* Header Section */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 sm:p-6 transition-shadow hover:shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                  <div className="relative mb-3 sm:mb-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-red-300 rounded-full opacity-20 animate-pulse"></div>
                    <img
                      src={
                        volunteer?.profile_picture ||
                        "https://img.freepik.com/free-vector/multicultural-concept-illustration_114360-25402.jpg"
                      }
                      alt="Volunteer Profile picture"
                      className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md relative z-10"
                    />
                  </div>
                  <div className="sm:ml-4">
                    <div className="flex flex-col sm:flex-row items-center mb-1 justify-center sm:justify-start">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-1 sm:mb-0 sm:mr-2">
                        DASHBOARD
                      </div>
                      <div className="text-sm text-gray-500">
                        Welcome to PledgeIt
                      </div>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold">
                      Hi there,{" "}
                      {volunteer ? `${volunteer.first_name}` : "Loading..."}!{" "}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-4  ">
            <div className="flex items-center justify-between p-10 bg-white/90 backdrop-blur-sm rounded-2xl  shadow-lg cursor-pointer border border-gray-100 lg:p-5 bg-image: url('assests/bg4.png') ">
              <div className=" text-gray-800 ">
                <p>Total Events Participated: </p>
                <p className="font-bold text-4xl">{volunteer?.event_id || 0}</p>
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
            <div className="flex items-center justify-between p-10 bg-white/90 backdrop-blur-sm rounded-2xl  shadow-lg cursor-pointer border border-gray-100 lg:p-5 ">
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
            <div className="flex items-center justify-between  bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 backdrop-blur-sm rounded-2xl p-10 shadow-lg cursor-pointer border border-gray-100 lg:p-5 ">
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
                className="w-25 h-25"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4  lg:mt-0 xl:grid-cols-2 ">
            <DailyQuotes />
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 overflow-y-auto h-96">
              <h3 className="text-lg font-semibold">
                Categories You Have Contributed
              </h3>
              <PieAnimation />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:mt-0 lg:grid-cols-1 xl:grid-cols-2 ">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 ">
              <h3 className="text-lg font-semibold">Volunteer Stats</h3>{" "}
              <BarChart />
            </div>
            <div className="bg-red-50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 overflow-y-auto h-96">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Volunteers</h3>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {volunteers.length > 0 ? (
                  volunteers.map((volunteer, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-4 shadow-md transition-shadow duration-300 border border-gray-100 flex items-center justify-between"
                    >
                      <div className="flex items-center justify-between">
                        {volunteers.profile_picture ? (
                          <img
                            src={volunteers.profile_picture}
                            alt="volunteer"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <img
                            src="assests/volunteer.png"
                            alt="volunteer"
                            className="w-6 h-6 text-red-500"
                          />
                          </div>
                        )}
                        <h4 className="text-md font-medium text-gray-700">
                          {volunteer.first_name} {volunteer.last_name}
                        </h4>
                      </div>
                      <p className="text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full">
                        12+</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-6">No volunteers available</p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:mt-0 ">
            <h2 className="pt-10 text-xl font-bold text-gray-800 text-center ">
              Latest Volunteer Events
            </h2>
            <HomeEvent />
          </div>
        </div>
        <Footer1 />
      </VolunteerDashboard>
    </>
  );
}
export default VolunteerHome;
