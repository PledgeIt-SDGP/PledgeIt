import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building } from 'lucide-react'; // Import icons

const UserPage = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    const handleCreateAccount = () => {
        if (selectedOption === 'volunteer') {
            navigate('/volSignup');
        } else if (selectedOption === 'organization') {
            navigate('/orgSignup');
        } else {
            alert('Please select an account type to continue');
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center ">
            <div className="max-w-5xl w-full px-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
                    Join PledgeIt Today!
                </h1>
                <div className="flex justify-center space-x-8">
                    {/* Volunteer Option */}
                    <div
                        className={`flex flex-col items-center p-8 border rounded-md w-75 cursor-pointer backdrop-blur-sm border-gray-100 transition hover:scale-105 hover:shadow-lg hover:shadow-red-500
              ${selectedOption === 'volunteer' ? 'border-red-100 shadow-lg backdrop-blur-sm shadow-red-400' : 'border-gray-300 hover:shadow'}`}
                        onClick={() => setSelectedOption('volunteer')}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <User size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            I'm a Volunteer
                        </h2>
                        <p className="text-gray-600 text-center">
                            Looking to make a difference? Find the perfect opportunity to share your time and skills.
                        </p>
                    </div>

                    {/* Organization Option */}
                    <div
                        className={`flex flex-col items-center p-8 border rounded-md w-75 cursor-pointer backdrop-blur-sm border-gray-100 transition hover:scale-105 hover:shadow-lg hover:shadow-red-500
              ${selectedOption === 'organization' ? 'border-red-100 shadow-lg backdrop-blur-sm shadow-red-400' : 'border-gray-300 hover:shadow'}`}
                        onClick={() => setSelectedOption('organization')}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <Building size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            I'm an Organization
                        </h2>
                        <p className="text-gray-600 text-center">
                            Need helping hands for your cause? Connect with passionate volunteers and amplify your impact.
                        </p>
                    </div>
                </div>

                <div className='flex justify-center'>
                    <button
                        onClick={handleCreateAccount}
                        className={`mt-12 py-3 px-8 rounded-md text-white font-bold transition 
                        ${selectedOption
                                ? 'bg-red-600 hover:bg-red-600 cursor-pointer'
                                : 'bg-red-500 cursor-not-allowed'
                            }`}
                        disabled={!selectedOption}
                    >
                        Create Account
                    </button>
                </div>
                <p className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-lg text-red-500 font-medium hover:underline">
                        Log In
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UserPage;