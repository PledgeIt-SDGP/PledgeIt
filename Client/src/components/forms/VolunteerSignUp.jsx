import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../auth/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import SignIn from "../auth/SignIn";

const VolunteerSignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Account created successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 m-10">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-700">PledgeIt</h1>
      </div>

      {/* Title and Info Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Create your personal account</h2>
      </div>

      {/* Social Login Buttons */}
      <div className="mt-6 space-y-4 w-72">
        <SignIn />
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center justify-center w-130">
        <hr className="flex-grow border-t" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow border-t" />
      </div>

      {/* Form Section */}
      <form className="space-y-4 w-140" onSubmit={handleSignUp}>
        <div className="flex gap-x-4">
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="flex gap-x-4">
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
        </div>

        {/* Display Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full mt-5 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Create Account
        </button>
      </form>

      <span className="mt-5">Already have an account?</span>
      <Link to="/logIn" className="font-bold text-red-400">
        Sign In
      </Link>
    </div>
  );
};

export default VolunteerSignUpPage;
