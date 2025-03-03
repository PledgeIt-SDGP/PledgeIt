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
        <div class="relative flex flex-col items-center justify-center min-h-screen pb-10 bg-gray-800">
            <div class="absolute inset-0 bg-[url('login.jpg')] bg-cover bg-center opacity-20 "></div>

            {/* Form Section */}
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="relative bg-gray-50 p-14 sm:p-16 md:p-18 rounded-lg shadow-md w-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
                    <p className='text-center text-gray-400 mb-4 sm:mb-6 '>Enter the credentials to log in</p>

                    <div className="mb-3 sm:mb-4">
                        <label className="block text-gray-700 text-sm sm:text-base mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., User@gmail.com"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div className="mb-4 sm:mb-6">
                        <label className="block text-gray-700 text-sm sm:text-base mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    {message && (
                        <p className={`text-sm mb-4 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>

                    <div className="mt-4 text-center">
                        <p className='text-gray-600'>Don't have an account?</p>
                        <a href="/user" className="text-md text-red-600 font-semibold hover:font-bold"> Sign in</a>
                    </div>

                </form>
            </div>
        </div>

    );

};

export default LoginPage;