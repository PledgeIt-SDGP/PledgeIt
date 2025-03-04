import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            // Handle successful login
            setMessage(response.data.message || 'Login successful!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-red-200">
            {/* Login Form Section */}
            <div className="w-full md:w-2/5 flex flex-col justify-center px-6 md:px-10 py-6 md:py-0">
                <div className="bg-white p-8 rounded-xl shadow-lg mx-auto w-full max-w-md py-15">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                        Welcome Back!
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        Enter your credentials to log in
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g., user@gmail.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                required
                            />
                        </div>

                        {message && (
                            <p className={`text-sm text-center ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">Don't have an account?</p>
                        <a href="/user" className="text-md text-red-600 font-semibold hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Side - Image Section */}
            <div className="hidden md:block w-3/5 relative">
                <img
                    src="loginbackground.png"
                    alt="loginbackground"
                    className="h-screen w-full object-cover rounded-lg"
                />
            </div>
        </div>
    );
};

export default LoginPage;