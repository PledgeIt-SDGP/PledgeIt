import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import { motion } from "framer-motion";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import VolunteerDashboard from "./VolunteerDashboard";
import Footer1 from "../../components/Footer1";

const ProfileSettings = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      // Create a new object to send only non-empty fields
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
      };

      // Add password fields only if they are filled
      if (formData.password && formData.password_confirmation) {
        dataToSend.password = formData.password;
        dataToSend.password_confirmation = formData.password_confirmation;
      }

      const response = await axios.put(
        "https://pledgeit-backend-production-production.up.railway.app/auth/volunteer/update",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Volunteer details updated:", response.data);

      // Update the user context with the new details
      setUser((prevUser) => ({
        ...prevUser,
        first_name: formData.first_name,
        last_name: formData.last_name,
      }));

      alert("Details updated successfully!");
    } catch (error) {
      console.error("Failed to update volunteer details:", error);
      alert("Failed to update details. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://pledgeit-backend-production-production.up.railway.app/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete("https://pledgeit-backend-production-production.up.railway.app/auth/volunteer/delete", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setUser(null);
        window.location.href = "/";
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <>
      <VolunteerDashboard>
        <motion.div
          className="flex justify-center items-center min-h-screen p-6"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658578/bg1_o0bjsb.jpg')",

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
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            {/* Profile Info */}
            <div className="flex items-center gap-4 my-6">
            <img
                src="https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658607/volunteer_m1ywl0.png"
                className="text-gray-500 text-5xl rounded-full border border-gray-300"
              />            <div>
                <h3 className="text-lg font-medium">
                  {user?.name || ""}
                </h3>
                <p className="text-gray-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleUpdateDetails}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="relative">
                  <input
                    className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                    placeholder="First Name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
                </div>

                <div className="relative">
                  <input
                    className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                    placeholder="Last Name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
                </div>

                <div className="relative">
                  <input
                    className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
                </div>

                <div className="relative">
                  <input
                    className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                    placeholder="Confirm Password"
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                  <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-between mt-6">
                <div>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition duration-200"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
        <Footer1 />
      </VolunteerDashboard>
    </>
  );
};

export default ProfileSettings;
