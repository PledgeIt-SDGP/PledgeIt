import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../../hooks/UserContext";

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
    
        try {
            const params = new URLSearchParams();
            params.append('email', formData.email);
            params.append('password', formData.password);
    
            const response = await axios.post("http://127.0.0.1:8000/auth/login", params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
    
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token); // Store token
            localStorage.setItem('userRole', user.role); // Store user role
            setUser(user); // Update user context
    
            setMessage("Login successful!");
    
            // Redirect to dashboard based on role
            setTimeout(() => {
                if (user.role === "volunteer") {
                    navigate("/volHome");
                } else if (user.role === "organization") {
                    navigate("/orgHome");
                }
            }, 1500);
    
        } catch (error) {
            setMessage(error.response?.data?.detail || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-red-200">
            <div className="w-full md:w-2/5 flex flex-col justify-center px-6 md:px-10 py-6 md:py-0">
                <div className="bg-white p-8 rounded-xl shadow-lg mx-auto w-full max-w-md py-15">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">Enter your credentials to log in</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="user@gmail.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="enter your password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    required
                                />
                            </div>
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
                        <a href="/userpage" className="text-md text-red-600 font-semibold hover:underline">Sign up</a>
                    </div>
                </div>
            </div>
            <div className="hidden md:block w-3/5 relative">
                <img src="loginbackground.png" alt="loginbackground" className="h-screen w-full object-cover rounded-lg" />
            </div>
        </div>
    );
};

export default LoginForm;