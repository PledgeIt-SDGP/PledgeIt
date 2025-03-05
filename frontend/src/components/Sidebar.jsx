import { Calendar, Heart, HeartHandshake, Home, MapPin, Menu, Settings, User, UserRound } from "lucide-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Separate MenuItem component for better readability and reusability
const MenuItem = ({ icon, name, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center cursor-pointer transition-colors duration-100 font-bold  ${
          isActive
            ? "bg-gradient-to-r from-red-500 to-orange-400 text-gray-50"
            : "text-gray-800 hover:bg-gray-200  hover:text-gray-900  "
        }`
      }
    >
      {React.cloneElement(icon, {
        "aria-hidden": true,
        className: "h-5 w-8 ml-5",
      })}
      <span className="font-medium text-sm p-3 w-full ">{name}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const menuItems = [
    { name: "Home", path: "/orgHome", icon: <Home /> },
    { name: "Events", path: "/dash", icon: <Calendar /> },
    { name: "Map", path: "/dash", icon: <MapPin /> },
    { name: "Profile", path: "/profile", icon: <UserRound/> },
    { name: "Settings", path: "/set", icon: <Settings /> },
  ];


  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen md:w-55 sm:w-0 bg-white shadow-md border-r border-gray-100">
      {/* Toggle Button for Small Screens */}
      <button
        className="md:hidden fixed top-5 left-5 z-1000 bg-orange-300 text-white p-2 "
        onClick={() => setIsOpen(!isOpen)}
      >
        
        <Menu />
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 flex flex-col min-h-screen w-55 shadow-md transition-all duration-300 ease-in-out ${
          isOpen ? "block" : "hidden sm:block md:block"
        }`}
      >
        <div className="flex flex-row py-15 px-5 h-35 border-b border-gray-200">
          <HeartHandshake className="h-8 w-8 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-orange-550">PledgeIt</h1>
        </div>

  

        <ul className="flex-1 pt-0 space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.name} {...item} />
          ))}
        </ul>

        <div className="flex fixed bottom-0 border-t border-gray-200 w-55">
          <div className="flex-1 bg-red-50 p-8"></div>
          <div className="flex-10 p-5 bg-red-100">profile Name</div>
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;
