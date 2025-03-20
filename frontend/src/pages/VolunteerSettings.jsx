import { motion } from "framer-motion";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import VolunteerDashboard from "./VolunteerDashboard";
import Footer1 from "../components/Footer1";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const [volunteer, setVolunteer] = useState(null); // Volunteer data will be fetched from API
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // For error handling
  const [currentDate, setCurrentDate] = useState(""); // State for date
  const navigate = useNavigate(); // For redirecting after logout

  // Fetch volunteer data from volunteer.json file
  useEffect(() => {
    // Fetch the data from the public directory (or an external API)
    fetch("/volunteers.json")
      .then((response) => response.json())
      .then((data) => {
        const loggedInVolunteer = data[2].volunteers[0]; // Assuming the logged-in user is John Doe (from event_id 3)
        setVolunteer(loggedInVolunteer);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching volunteer data:", err);
        setError("Failed to load volunteer data.");
        setIsLoading(false);
      });

    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  // Handle deleting the volunteer account
  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      fetch("/volunteers.json")
        .then((response) => response.json())
        .then((data) => {
          const updatedData = data.map((event) => {
            event.volunteers = event.volunteers.filter(
              (vol) => vol.email !== volunteer.email
            );
            return event;
          });

          // Normally here you'd send a POST request or PUT request to the server to update the volunteer data
          // For now, we'll just log the updated data
          console.log("Updated data after deletion:", updatedData);
          alert("Account Deleted");
        })
        .catch((err) => console.error("Error deleting account:", err));
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVolunteer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    alert("Profile Updated");
    console.log(volunteer); // Log the updated volunteer data

    // Send the updated data to your backend server here
  };

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("volunteerToken"); // Remove token (if stored)
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page
    }
  };

  // Show loading state or error message if needed
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <VolunteerDashboard>
        <motion.div
          className="flex justify-center items-center min-h-screen p-6 "
          style={{
            backgroundImage: "url('/assests/background1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/95 shadow-lg rounded-2xl w-full p-6 mt-12 ">
            {/* Header */}
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Profile Settings
              </h2>
            </div>
            <p className="text-sm text-gray-500">{currentDate}</p>
            {/* Profile Info */}
            <div className="flex items-center gap-4 my-6">
              <FaUserCircle className="text-gray-500 text-5xl" />
              <div>
                <h3 className="text-lg font-medium">
                  {" "}
                  {volunteer.first_name} {volunteer.last_name}
                </h3>
                <p className="text-gray-500">{volunteer.email}</p>
              </div>
            </div>
            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="First Name"
                  type="text"
                  value={volunteer.first_name}
                  onChange={handleChange}
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Last Name"
                  type="text"                  value={volunteer.last_name}
                  onChange={handleChange}
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Password"
                  type="password"
                  value={volunteer.password}
                  onChange={handleChange}
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Confirm Password"
                  type="password"
                  value={volunteer.confirm_password}
                  onChange={handleChange}
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Email"
                  type="email"
                  value={volunteer.email}
                  onChange={handleChange}
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>

              <div className="relative">
                <input
                  className="border border-gray-400 p-3 rounded-lg w-full text-gray-700"
                  placeholder="Contact Number"
                  type="contact"
                  value={volunteer.contactNumber}
                  onChange={handleChange}
                />
                <FaEdit className="absolute top-3 right-3 text-gray-500 cursor-pointer" />
              </div>
              {/* Save Changes Button */}
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Logout
                </button>

                <button
                  onClick={handleSaveChanges}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition duration-200"
                >
                  Save Changes
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition duration-200"
                >
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
