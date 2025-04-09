import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import volBackground from '../../assets/volbackground.webp';
import { BadgeInfo, X, CheckCircle, Loader2 } from 'lucide-react';

const VolunteerSignupForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
        } else if (formData.firstName.length < 2) {
            errors.firstName = "First name must be at least 2 characters";
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
        } else if (formData.lastName.length < 2) {
            errors.lastName = "Last name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter a valid email";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            errors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
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
            setMessage({ text: "Please fix the form errors", type: "error" });
            return;
        }

        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.post("http://127.0.0.1:8000/auth/volunteer/register", {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('userRole', response.data.user.role);

            setMessage({ 
                text: "Registration successful! Redirecting to your dashboard...", 
                type: "success" 
            });
            
            setTimeout(() => {
                navigate("/volhome");
            }, 2000);

        } catch (error) {
            let errorMessage = "An error occurred while submitting the form.";
            
            if (error.response) {
                if (error.response.data?.errors) {
                    // Handle backend validation errors
                    const backendErrors = {};
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        backendErrors[field] = messages.join(", ");
                    });
                    setValidationErrors(backendErrors);
                    errorMessage = "Please fix the validation errors";
                } else {
                    errorMessage = error.response.data?.detail || errorMessage;
                }
            } else if (error.request) {
                errorMessage = "Network error. Please check your connection.";
            }
            
            setMessage({ 
                text: errorMessage, 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseMessage = () => {
        setMessage({ text: '', type: '' });
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen pb-10 bg-gray-800">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${volBackground})` }}
            ></div>

            {/* Message Pop-up */}
            {message.text && (
                <div className={`fixed top-4 right-4 z-50 ${
                    message.type === "error" 
                        ? "bg-red-100 border-red-400 text-red-700" 
                        : "bg-green-100 border-green-400 text-green-700"
                } border px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-md`}>
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

                <div className="flex gap-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">First Name *</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full border ${
                                validationErrors.firstName ? "border-red-500" : "border-gray-300"
                            } rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                        />
                        {validationErrors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Last Name *</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full border ${
                                validationErrors.lastName ? "border-red-500" : "border-gray-300"
                            } rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                        />
                        {validationErrors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border ${
                            validationErrors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                    />
                    {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                </div>

                <div className="flex gap-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Password *</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full border ${
                                validationErrors.password ? "border-red-500" : "border-gray-300"
                            } rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full border ${
                                validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                            } rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200`}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                    <BadgeInfo className="mt-0.5" size={16} />
                    <p>Password must contain at least 8 characters, including uppercase, lowercase, number, and special character</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-200 flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Creating Account...
                        </>
                    ) : "Create Account"}
                </button>
            </form>
        </div>
    );
};

export default VolunteerSignupForm;