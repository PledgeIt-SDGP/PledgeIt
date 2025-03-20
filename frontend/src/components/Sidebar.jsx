import {
  Calendar,
  Home,
  MapPin,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const MenuItem = ({ icon, name, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center cursor-pointer transition-all duration-200 font-bold rounded-md ${
          isActive
            ? "bg-gradient-to-r from-red-500 to-orange-400 text-white"
            : "text-gray-800 hover:bg-gray-200"
        } p-3`
      }
    >
      {React.cloneElement(icon, {
        "aria-hidden": true,
        className: "h-5 w-5",
      })}
      <span className="ml-3 text-sm">{name}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const menuItems = [
    { name: "Home", path: "/volunteerHome", icon: <Home /> },
    { name: "Events", path: "/event", icon: <Calendar /> },
    { name: "Map", path: "/map", icon: <MapPin /> },
    { name: "Profile", path: "/profile", icon: <UserRound /> },
    { name: "Settings", path: "/volunteerSettings", icon: <Settings /> },
  ];

  const [user] = useState({
    username: "unknown",
    profile_picture: "",
    type: "NGO",
  });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" md:w-60 sm:w-0 bg-white shadow-md border-r border-gray-100 min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-5 left-5 z-1000 bg-orange-500 text-white p-2 rounded "
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed z-100 top-0 left-0 flex flex-col min-h-screen w-60 shadow-md transition-transform duration-300 ease-in-out ${
          isOpen
            ? "translate-x-0 bg-white"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center py-18 sm:py-10 px-5 border-b border-gray-200 ">
          <img src="assests/logo.png" className="h-10 w-12 text-orange-700 mr-2" />
          <h1 className="text-2xl font-bold text-orange-700 ">PledgeIt</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex-grow p-3 space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.name} {...item} />
          ))}
        </nav>

        {/* Profile Section */}
        <div className="flex items-center gap-3 p-4 border-t border-gray-200 bg-gray-50 ">
          <img
            src={user.profile_picture || "https://i.pravatar.cc/150?u=1"}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">
              {user.username || "Loading..."}
            </p>
            <p className="text-xs text-gray-500">{user.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
