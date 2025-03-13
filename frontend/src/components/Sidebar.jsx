import { Calendar, HeartHandshake, Home, MapPin, Menu, Settings, UserRound, X } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const MenuItem = ({ icon, name, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center cursor-pointer transition-all duration-300 font-medium rounded-xl ${
          isActive
            ? "bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white shadow-md shadow-orange-200"
            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
        } p-3 my-1 relative overflow-hidden group`
      }
    >
      <div className={`flex items-center justify-center h-9 w-9 rounded-lg mr-3 transition-colors duration-300 ${
        ({ isActive }) => isActive ? "bg-white bg-opacity-20" : "bg-orange-100 text-orange-500"
      }`}>
        {React.cloneElement(icon, {
          "aria-hidden": true,
          className: "h-5 w-5",
        })}
      </div>
      <span className="text-sm">{name}</span>
      
      {/* Animated hover indicator */}
      <div className="absolute right-0 h-full w-1 transform scale-y-0 bg-gradient-to-b from-red-500 to-orange-500 rounded-l group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
    </NavLink>
  );
};

const Sidebar = () => {
  const menuItems = [
    { name: "Home", path: "/orgHome", icon: <Home /> },
    { name: "Events", path: "/event", icon: <Calendar /> },
    { name: "Map", path: "/map", icon: <MapPin /> },
    { name: "Profile", path: "/profile", icon: <UserRound /> },
    { name: "Settings", path: "/set", icon: <Settings /> },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:w-60 sm:w-0 bg-white shadow-lg border-r border-gray-100 min-h-screen">
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-5 left-5 z-50 bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed z-40 top-0 left-0 flex flex-col h-full w-60 bg-white shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-8 px-5 border-b border-gray-100">
          <div className="relative">
            <div className="flex items-center relative">
              <div>
                <img src="logo.png" alt="PledgeIt Logo" className="w-15 h-13 object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-red-600">
                PledgeIt
              </h1>
            </div>
          </div>
          
          {/* Mobile close button */}
          {isOpen && (
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden absolute right-3 top-8 text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              <X size={24} className="text-red-700 bg-red-50 rounded-full p-1" />

            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Menu
            </p>
            {menuItems.map((item) => (
              <MenuItem key={item.name} {...item} />
            ))}
          </div>
        </nav>

        {/* Bottom decorative element */}
        <div className="p-4 mx-3 mb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 -mt-6 -mr-6 bg-gradient-to-br from-red-500 to-orange-600 rounded-full opacity-20"></div>
          <div className="relative z-10">
            <HeartHandshake className="h-6 w-6 text-orange-500 mb-2" />
            <h3 className="text-sm font-medium text-gray-800">Make an Impact</h3>
            <p className="text-xs text-gray-600 mt-1">Connect with your community today</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;