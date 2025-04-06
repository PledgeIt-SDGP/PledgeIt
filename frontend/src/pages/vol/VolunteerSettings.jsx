import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import { motion } from "framer-motion";
import { FaUserCircle, FaEdit, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import VolunteerDashboard from "./VolunteerDashboard";
import Footer1 from "../../components/Footer1";

const ProfileSettings = () => {
  const { user, setUser, refreshUser } = useUser();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    current_password: "",
    new_password: "",
    password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";

    // Only validate passwords if they're being changed
    if (formData.new_password || formData.password_confirmation) {
      if (!formData.current_password) newErrors.current_password = "Current password is required";
      if (formData.new_password.length < 8) newErrors.new_password = "Password must be at least 8 characters";
      if (formData.new_password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", formData.first_name);
      formData.append("last_name", formData.last_name);

      if (formData.new_password) {
        formData.append("current_password", formData.current_password);
        formData.append("new_password", formData.new_password);
        formData.append("password_confirmation", formData.password_confirmation);
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/auth/volunteer/update",
        formData,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success
      toast.success("Profile updated successfully!");
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        current_password: "",
        new_password: "",
        password_confirmation: "",
      }));
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/logout",
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
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(
        "http://127.0.0.1:8000/auth/volunteer/delete",
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
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.response?.data?.detail || "Failed to delete account");
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
          <div className="bg-white/95 shadow-lg rounded-2xl w-full max-w-4xl p-6 mt-12">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Profile Settings
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-4 my-6">
              <img
                src="https://res.cloudinary.com/dwh8vc3ua/image/upload/v1742658607/volunteer_m1ywl0.png"
                alt="Profile"
                className="w-16 h-16 rounded-full border border-gray-300 object-cover"
              />
              <div>
                <h3 className="text-lg font-medium">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleUpdateDetails}>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* First Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    className={`border ${errors.first_name ? 'border-red-500' : 'border-gray-400'} p-3 rounded-lg w-full text-gray-700`}
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    className={`border ${errors.last_name ? 'border-red-500' : 'border-gray-400'} p-3 rounded-lg w-full text-gray-700`}
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                  )}
                </div>

                {/* Current Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password (for password change)
                  </label>
                  <input
                    className={`border ${errors.current_password ? 'border-red-500' : 'border-gray-400'} p-3 rounded-lg w-full text-gray-700`}
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                  {errors.current_password && (
                    <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    className={`border ${errors.new_password ? 'border-red-500' : 'border-gray-400'} p-3 rounded-lg w-full text-gray-700`}
                    type="password"
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  {errors.new_password && (
                    <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    className={`border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-400'} p-3 rounded-lg w-full text-gray-700`}
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="flex justify-between mt-8">
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-400 transition duration-200 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-400 transition duration-200"
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