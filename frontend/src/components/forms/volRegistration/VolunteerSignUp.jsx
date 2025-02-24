import React, { useState } from "react";
import { auth } from "../../../firebase";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

const VolunteerSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Google Sign-Up
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // Send token to backend
      await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName: result.user.displayName, email: result.user.email }),
      });

      console.log("Signed up with Google");
    } catch (error) {
      console.error("Google Sign-In Failed:", error);
    }
  };

  // Handle Email/Password Sign-Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();

      // Send token and user data to backend
      await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("Signed up successfully");
    } catch (error) {
      console.error("Sign-Up Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-orange-700">PledgeIt</h1>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Create your personal account</h2>
      </div>

      {/* Google Sign-In */}
      <div className="mt-6 space-y-4 w-72">
        <button onClick={handleGoogleSignUp} className="w-full flex items-center justify-center py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
          <img src="https://dash.pointapp.org/static/media/google.63de60dbfe3bc89c2c6dbe323e9ef158.svg" alt="Google" className="h-5 mr-3" />
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center justify-center w-130">
        <hr className="flex-grow border-t" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow border-t" />
      </div>

      {/* Email/Password Sign-Up */}
      <form onSubmit={handleEmailSignUp} className="space-y-4 w-140">
        <div className="flex gap-x-4">
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">First Name *</label>
            <input name="firstName" onChange={handleChange} type="text" placeholder="First Name" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" required />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Last Name *</label>
            <input name="lastName" onChange={handleChange} type="text" placeholder="Last Name" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" required />
          </div>
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Email Address *</label>
          <input name="email" onChange={handleChange} type="email" placeholder="Email Address" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" required />
        </div>
        <div className="flex gap-x-4">
          <div className="flex-1">
            <label className="block text-gray-600 mb-1">Password *</label>
            <input name="password" onChange={handleChange} type="password" placeholder="Enter your password" className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" required />
          </div>
        </div>
        <button type="submit" className="w-full mt-5 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-200">
          Create Account
        </button>
      </form>

      <span className="mt-5">Already have an account?</span>
      <a href="/logIn" className="font-bold text-red-400">Sign In</a>
    </div>
  );
};

export default VolunteerSignUp;
