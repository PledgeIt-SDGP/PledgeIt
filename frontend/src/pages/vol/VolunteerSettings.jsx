import { motion } from "framer-motion";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import VolunteerDashboard from "./VolunteerDashboard";
import Footer1 from "../../components/Footer1";

const ProfileSettings = () => {
  return (
    <>
      <VolunteerDashboard>
        <motion.div
          className="flex justify-center items-center min-h-screen p-6"
          style={{
            backgroundImage: "url('/assests/background1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/95 shadow-lg rounded-2xl w-full p-6 mt-12">
            {/* Header */}
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Profile Settings
              </h2>
            </div>
            <p className="text-sm text-gray-500">Mon, October 30, 2023</p>

            {/* Profile Info */}
            <div className="flex items-center gap-4 my-6">
              <FaUserCircle className="text-gray-500 text-5xl" />
              <div>
                <h3 className="text-lg font-medium">John Doe</h3>
                <p className="text-gray-500">john.doe@example.com</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="First Name"
                  type="text"
                  value="John"
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Last Name"
                  type="text"
                  value="Doe"
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Password"
                  type="password"
                  value="password123"
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Confirm Password"
                  type="password"
                  value="password123"
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Email"
                  type="email"
                  value="john.doe@example.com"
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Contact Number"
                  type="contact"
                  value="+1234567890"
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-end mt-6 space-x-4">
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200">
                  Logout
                </button>

                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition duration-200">
                  Save Changes
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition duration-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <Footer1 />
      </VolunteerDashboard>
    </>
  );
};

export default ProfileSettings;