import React from "react";
import Footer1 from "../../components/Footer1";
import VolunteerDashboard from "./VolunteerDashboard";
import HomeEvent from "../../components/home/HomeEvent";
import DailyQuotes from "../../components/vol-dash/DailyQuotes";
import { useUser } from "../../hooks/UserContext";
import { LineChart, PieChart, Users } from "lucide-react";
import TopVolunteers from "../../components/org-dash/TopVolunteers";

function VolunteerHome() {
  const { user, setUser } = useUser();

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
                        "https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658607/volunteer_m1ywl0.png"
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
                      {user && <h1>Hi there, {user.name} !</h1>}
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
                    href="/volevents"
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
              {/* <PieAnimation /> */}
              <p className="flex justify-center text-orange-600 text-center border border-dashed p-8 m-14">
                Participate in events to earn XP points!
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:mt-0 lg:grid-cols-1 xl:grid-cols-2 ">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 ">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <LineChart size={20} color="black" className="text-green-500" />
                Monthly XP Points Earned
              </h3>{" "}
              {/* <BarChart /> */}
              <p className="flex justify-center text-orange-600 text-center border border-dashed p-8 m-14">
                Participate in events to earn XP points!
              </p>
            </div>
            <div className="bg-red-50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 overflow-x-auto h-96">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-6">
                <Users size={20} color="black" className="text-blue-500" />
                Top Volunteers
              </h3>
              <TopVolunteers />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:mt-0  ">
            <h2 className="flex justify-center pt-10 text-xl font-bold text-gray-800">
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
