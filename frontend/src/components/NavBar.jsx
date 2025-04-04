import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md  z-50 ">
      <div className="container flex justify-between  items-center py-4  px-6 ">
        {/* Logo */}
        <div className="flex items-center pl-6 ">
          <img src="assests/logo.png" alt="Logo" className="h-10" />
          <p className="text-xl font-bold text-black text-align-start">
            PledgeIt
          </p>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center ml-auto  ">
          <li>
            <a href="#Home" className="text-gray-700 hover:text-orange-600">
              Home
            </a>
          </li>
          <li>
            <a
              href="#HomeAboutUs"
              className="text-gray-700 hover:text-orange-600"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#Features"
              className="text-gray-700 hover:text-orange-600"
            >
              Features
            </a>
          </li>
          {/*Add signup page */}

          <Link
            to="/userpage"
            className="px-4 py-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:opacity-80 lg:px-6 lg:py-3"
          >
            Sign up
          </Link>
          
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
              <a href="#Home" className="text-gray-700 hover:text-orange-600">
                Home
              </a>
            </li>
            <li>
              <a
                href="#HomeAboutUs"
                className="text-gray-700 hover:text-orange-600"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#HomeFeatures"
                className="text-gray-700 hover:text-orange-600"
              >
                Features
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
