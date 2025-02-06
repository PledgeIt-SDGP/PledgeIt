import React from "react";

const VolunteerSignUpPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold  text-orange-700 ">PlegeIt</h1>
      </div>

      {/* Title and Info Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Create your personal account</h2>
    
      </div>

      {/* Social Login Buttons */}
      <div className="mt-6 space-y-4 w-72">
        <button className="w-full flex items-center justify-center py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
          <img
            src="https://dash.pointapp.org/static/media/google.63de60dbfe3bc89c2c6dbe323e9ef158.svg"
            alt="Google"
            className="h-5 mr-3"
          />
          Continue with Google
        </button>
        
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center justify-center w-130">
        <hr className="flex-grow border-t" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow border-t" />
      </div>

      {/* Form Section */}
      <form className="space-y-4 w-140">
        <div className="flex gap-x-4">
        <div className="flex-1">
          <label className="block text-gray-600 mb-1">First Name *</label>
          <input
            type="text"
            placeholder="First Name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-600 mb-1">Last Name *</label>
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Email Address *</label>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex gap-x-4">
        <div className="flex-1">
          <label className="block text-gray-600 mb-1">Password *</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-600 mb-1">Confirm Password *</label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        </div>
        <button
          type="submit"
          className="w-full mt-5 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Create Account
        </button>
      </form>
      <span className="mt-5"> Already have an account?</span>
      <a href="/logIn" className="font-bold text-red-400">Sign In</a>
    </div>
  );
};

export default VolunteerSignUpPage;