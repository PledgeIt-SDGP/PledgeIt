import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, CheckCircle, Loader2 } from 'lucide-react';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage({ text: 'Please fix the form errors', type: 'error' });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const params = new URLSearchParams();
            params.append('email', formData.email);
            params.append('password', formData.password);

            const response = await axios.post("https://pledgeit-backend-ihkh.onrender.com/auth/login", params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('userRole', user.role);

            setMessage({ text: "Login successful! Redirecting...", type: "success" });

            setTimeout(() => {
                if (user.role === "volunteer") {
                    navigate("/volHome");
                } else if (user.role === "organization") {
                    navigate("/orgHome");
                }
            }, 1500);

        } catch (error) {
            let errorMessage = "Login failed. Please try again.";
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = "Invalid email or password";
                } else {
                    errorMessage = error.response.data?.detail || errorMessage;
                }
            } else if (error.request) {
                errorMessage = "Network error. Please check your connection";
            }
            setMessage({ text: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseMessage = () => {
        setMessage({ text: '', type: '' });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-radial from-red-300 from-50% to-pink-700">
            <div className="w-full md:w-2/5 flex flex-col justify-center px-6 md:px-10 py-6 md:py-0">
                <div className="bg-white p-8 rounded-xl shadow-lg mx-auto w-full max-w-md py-15 relative">
                    {/* Message Pop-up */}
                    {message.text && (
                        <div className={`fixed top-4 right-4 z-50 ${message.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"} border px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-md`}>
                            <div className="flex items-center">
                                {message.type === "error" ? (
                                    <X className="w-5 h-5 mr-2" />
                                ) : (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                )}
                                <span>{message.text}</span>
                            </div>
                            <button onClick={handleCloseMessage} className="ml-4">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">Enter your credentials to log in</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="user@gmail.com"
                                className={`w-full border ${validationErrors.email ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400`}
                            />
                            {validationErrors.email && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">Password *</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="enter your password"
                                    className={`w-full border ${validationErrors.password ? "border-red-500" : "border-gray-300"} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400`}
                                />
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Logging in...
                                </>
                            ) : "Log In"}
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