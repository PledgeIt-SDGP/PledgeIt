import React from "react";
import { CalendarDays, Users } from "lucide-react";
import CountUp from "react-countup";

const CountCards = ({ totalEvents, totalVolunteers, loading }) => {
  if (loading) return null;

  // top-4 and left-16 for spacing remain unchanged
  return (
    <div className="absolute top-4 left-16 z-[1001] flex flex-col sm:flex-row gap-2">
      {/* Events Card */}
      <div className="bg-white/90 backdrop-blur-lg rounded-md shadow-md px-4 py-2 flex items-center gap-2">
        <CalendarDays className="text-red-500 h-5 w-5" strokeWidth={1.5} fill="none" />
        <p className="text-sm text-gray-700">
          Events:{" "}
          <span className="font-bold text-red-600">
            <CountUp end={totalEvents} duration={1.5} />
          </span>
        </p>
      </div>

      {/* Volunteers Card */}
      <div className="bg-white/90 backdrop-blur-lg rounded-md shadow-md px-4 py-2 flex items-center gap-2">
        <Users className="text-red-500 h-5 w-5" strokeWidth={1.5} fill="none" />
        <p className="text-sm text-gray-700">
          Volunteers:{" "}
          <span className="font-bold text-red-600">
            <CountUp end={totalVolunteers} duration={1.5} />
          </span>
        </p>
      </div>
    </div>
  );
};

export default CountCards;