import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import volBackground from '../../assets/volbackground.webp';
// import { useUser } from '../../hooks/UserContext'; // Import useUser hook

const VolunteerSignupForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    // const { setUser } = useUser(); // Get setUser from User Context

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            setShowError(true);
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setShowError(true);
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/volunteer/register", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                password_confirmation: confirmPassword,
            });

            // Store token and role in localStorage
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('userRole', response.data.user.role);

            // Update user context
            // setUser(response.data.user);

            setSuccess("Registration successful!");
            setError('');
            setShowError(false);

            // Redirect to dashboard after 4 seconds
            setTimeout(() => {
                navigate("/volhome");
            }, 4000);

        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred while submitting the form.");
            setShowError(true);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen pb-10 bg-gray-800">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${volBackground})` }}
            ></div>

            <form
                onSubmit={handleSubmit}
                className="relative space-y-4 w-[90%] sm:w-160 bg-white rounded-lg px-5 sm:px-15 py-8 border border-gray-300 border-opacity-50 my-15"
            >
                <div className="mb-3 text-center">
                    <h1 className="text-3xl font-bold text-orange-700">PledgeIt</h1>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Create your personal account</h2>
                </div>
                {/* Form Fields */}
                <div className="flex gap-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">First Name *</label>
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Last Name *</label>
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">Email Address *</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="flex gap-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Password *</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Confirm Password *</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Toast Notifications */}
            {showError && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white py-2 px-4 rounded-lg shadow-md">
                    {error}
                </div>
            )}
            {success && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-4 rounded-lg shadow-md">
                    {success}
                </div>
            )}
        </div>
    );
};

export default VolunteerSignupForm;