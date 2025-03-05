import { Calendar, Home, MapPin, Menu, Settings } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import VDashboard from "./volunteerDashboard/VDashboard";

// Separate MenuItem component for better readability and reusability
const MenuItem = ({ icon, name, path, isActive }) => {
  return (
    <li
      className={`
      flex items-center rounded-lg cursor-pointer transition-colors duration-200 font-bold 
      ${
        isActive
          ? "bg-orange-100 text-orange-700"
          : "text-gray-700 hover:bg-orange-50"
      }
    `}
    >
      {React.cloneElement(icon, {
        "aria-hidden": true,
        className: "h-5 w-5 ml-3 ",
      })}
      <Link
        to={path}
        className="font-medium text-sm p-3 w-full "
        aria-current={isActive ? "page" : undefined}
      >
        {name}
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const menuItems = [
    { name: "Home", path: "/volunteerDashboard", icon: <Home /> },
    { name: "Events", path: "/event", icon: <Calendar /> },
    { name: "Map", path: "/map", icon: <MapPin /> },
    { name: "Settings", path: "/settings", icon: <Settings /> },
  ];

  const currentPath = window.location.pathname;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen md:w-64 sm:w-0 bg-white shadow-md border-r border-gray-100 fixed z-100">
      {/* Toggle Button for Small Screens */}
      <button
        className="md:hidden fixed top-5 left-5 z-10 bg-orange-300 text-white p-2 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </button>

      {/* Sidebar Content */}
      <div
        className={`flex flex-col h-screen w-64 bg-gray-50 shadow-md border-r border-gray-100 ${
          isOpen ? "block" : "hidden sm:block md:block"
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-orange-600">PledgeIt</h1>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-500">
            Manage your account and preferences.
          </p>
          <div className="p-3 bg-red-50">profile comes here</div>
        </div>

        <ul className="flex-1 p-4 pt-0 space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.name}
              {...item}
              isActive={currentPath === item.path}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
