import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    const handleCreateAccount = () => {
        if (selectedOption === 'client') {
            navigate('/VolSignUp');
        } else if (selectedOption === 'freelancer') {
            navigate('/OrgSignUp');
        } else {
            // If no option is selected, alert the user
            alert('Please select an account type to continue');
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="pt-8 pb-12">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Join as a Volunteer or Volunteer Organization</h1>
                    </div>

                    <div className="flex justify-center space-x-6 mb-12">
                        {/* Client Option */}
                        <div
                            className={`flex flex-col px-8 py-10 border rounded-md w-72 cursor-pointer transition ${selectedOption === 'client' ? 'border-[#de362e]' : 'border-gray-300 hover:border-gray-400'}`}
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
                                    {selectedOption === 'client' && <div className="w-4 h-4 rounded-full bg-[#de362e]"></div>}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Volunteer,</h2>
                            <p className="text-xl font-bold text-gray-900">looking to volunteer</p>
                        </div>

                        {/* Freelancer Option */}
                        <div
                            className={`flex flex-col px-8 py-10 border rounded-md w-72 cursor-pointer transition ${selectedOption === 'freelancer' ? 'border-[#de362e]' : 'border-gray-300 hover:border-gray-400'}`}
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
                                    {selectedOption === 'freelancer' && <div className="w-4 h-4 rounded-full bg-[#de362e]"></div>}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Volunteer Organization,</h2>
                            <p className="text-xl font-bold text-gray-900">looking for Volunteers</p>
                        </div>
                    </div>

                    <div className="flex justify-center mb-6">
                        <button
                            onClick={handleCreateAccount}
                            className={`py-3 px-6 rounded-md transition ${selectedOption ? 'bg-[#de362e] hover:bg-[#ad241d] text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account? <a href="/logIn" className="text-[#de362e] font-medium hover:underline">Log In</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;