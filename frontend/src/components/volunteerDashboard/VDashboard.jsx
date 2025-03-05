import React from "react";
import Sidebar from "../Sidebar";
import Footer1 from "../Footer1";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BarChart from "./BarChart";

function VDashboard() {
  const { id } = useParams(); // Get user ID from URL
  const [volunteer, setVolunteer] = useState(null);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const response = await fetch("/events.json");
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

  return (
    <>
      <Sidebar />

      <div class="grid gap-4 p-4 lg:ml-70 min-h-screen ">
        <div className="text-gray-800 mt-10">Welcome to PledgeIt !</div>
        <div className=" text-3xl font-bold text-gray-800 ">
          <h1>{volunteer}</h1>
        </div>
        <div class="grid lg:grid-cols-3 gap-4 mt-10 h-40 ">
          <div class="col-span-1  bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 ">
            <p className="mt-10">Total Events Participated</p>
          </div>
          <div class="col-span-1 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 ">
            <p className="mt-10">Total Hours Volunteered</p>
          </div>
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 ">
            card2
          </div>
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 ">
            card3
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-40 lg:mt-0 lg:grid-cols-2">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100">
            Volunteer Stats
            <BarChart />
          </div>
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100">
            Card 4
          </div>
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100">
            Card 5
          </div>
        </div>
      </div>
      <Footer1 />
    </>
  );
}
export default VDashboard;
