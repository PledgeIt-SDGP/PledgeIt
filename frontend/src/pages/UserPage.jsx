import React, { useState } from 'react';

const UserPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="pt-8 pb-12">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="mb-8">
                        <svg viewBox="0 0 102 28" className="w-28 h-8 text-gray-900" fill="currentColor">
                            <path d="M28.18,19.06A6.54,6.54,0,0,1,23,16c.67-5.34,2.62-7,5.2-7s4.54,2,4.54,5-2,5-4.54,5m0-13.34a7.77,7.77,0,0,0-7.9,6.08,26,26,0,0,1-1.93-5.62H12v7.9c0,2.87-1.3,5-3.85,5s-4-2.12-4-5l0-7.9H.49v7.9A8.61,8.61,0,0,0,2.6,20a7.27,7.27,0,0,0,5.54,2.35c4.41,0,7.5-3.39,7.5-8.24V8.77a25.87,25.87,0,0,0,3.66,8.05L17.34,28h3.72l1.29-7.92a11,11,0,0,0,1.36,1,8.32,8.32,0,0,0,4.14,1.28h.34A8.1,8.1,0,0,0,36.37,14a8.12,8.12,0,0,0-8.19-8.31"></path>
                            <path d="M80.8,7.86V6.18H77.2V21.81h3.65V15.69c0-3.77.34-6.48,5.4-6.13V6c-2.36-.13-4.34.68-5.45,1.91"></path>
                            <polygon points="55.51 6.18 52.87 17.2 50.05 6.18 45.41 6.18 42.59 17.2 39.95 6.18 36.26 6.18 40.31 21.81 44.69 21.81 47.73 10.62 50.73 21.81 55.12 21.81 59.2 6.18 55.51 6.18"></polygon>
                            <path d="M67.42,19.06c-2.5,0-4.54-2-4.54-5s2-5,4.54-5,4.54,2,4.54,5-2,5-4.54,5m0-13.34A8.1,8.1,0,0,0,59.25,14,8.12,8.12,0,1,0,75.61,14a8.1,8.1,0,0,0-8.19-8.31"></path>
                            <path d="M91.47,14.13h.84l5.09,7.68h4.44l-5.24-7.6a6.85,6.85,0,0,0,4.74-6.58c0-3.65-2.73-6.18-6.75-6.18H86.37V21.81h3.65V14.13h1.45ZM90,6.67h4.71a3.2,3.2,0,0,1,3.23,3.14A3.31,3.31,0,0,1,94.77,13H90Z"></path>
                        </svg>
                    </div>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Join as a client or freelancer</h1>
                    </div>

                    <div className="flex justify-center space-x-6 mb-12">
                        {/* Client Option */}
                        <div
                            className={`flex flex-col px-8 py-10 border rounded-md w-72 cursor-pointer transition ${selectedOption === 'client' ? 'border-green-500' : 'border-gray-300 hover:border-gray-400'}`}
                            onClick={() => setSelectedOption('client')}
                        >
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" className="text-gray-700">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                                    {selectedOption === 'client' && <div className="w-4 h-4 rounded-full bg-green-500"></div>}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a client,</h2>
                            <p className="text-xl font-bold text-gray-900">hiring for a project</p>
                        </div>

                        {/* Freelancer Option */}
                        <div
                            className={`flex flex-col px-8 py-10 border rounded-md w-72 cursor-pointer transition ${selectedOption === 'freelancer' ? 'border-green-500' : 'border-gray-300 hover:border-gray-400'}`}
                            onClick={() => setSelectedOption('freelancer')}
                        >
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" className="text-gray-700">
                                        <path d="M19 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M19 9V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="3" y="9" width="18" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                                    {selectedOption === 'freelancer' && <div className="w-4 h-4 rounded-full bg-green-500"></div>}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a freelancer,</h2>
                            <p className="text-xl font-bold text-gray-900">looking for work</p>
                        </div>
                    </div>

                    <div className="flex justify-center mb-6">
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md transition">
                            Create Account
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account? <a href="#" className="text-green-600 font-medium hover:underline">Log In</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;