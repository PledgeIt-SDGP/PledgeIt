import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full scroll top-0 z-50  ">
      <div className="container flex justify-between  items-center py-4  px-6 ">
        {/* Logo */}
        <div className="flex items-center pl-6 ">
          <img src="assests/logo.png" alt="Logo" className="h-10" />
          <p className="text-xl font-bold text-black text-align-start">
            PledgeIt
          </p>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center ml-auto  " >
          <li>
            <a href="#Home" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <a
              href="#HomeAboutUs"
              className="text-gray-700 hover:text-blue-600"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#HomeFeature"
              className="text-gray-700 hover:text-blue-600"
            >
              Features
            </a>
          </li>
          <button className="bg-orange-600 hover:opacity-90 text-sm text-white  rounded-2xl shadow-md hover:bg-orange-500  md:px-6 md:py-2  lg:px-6 lg:py-2 lg:text-md">
            Sign Up
          </button>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 "
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-4 p-4">
            <li>
              <a href="#Home" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="#HomeAboutUs" className="text-gray-700 hover:text-blue-600">
                About
              </a>
            </li>
            <li>
              <a href="#HomeFeatures" className="text-gray-700 hover:text-blue-600">
                Features
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
