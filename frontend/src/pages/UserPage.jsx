import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building } from 'lucide-react';

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
        <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4">
            <div className="max-w-5xl w-full px-6 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                    Join PledgeIt Today!
                </h1>

                {/* Options Section */}
                <div className="flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-4 sm:space-y-0">
                    {/* Volunteer Option */}
                    <div
                        className={`flex flex-col items-center p-6 sm:p-8 border rounded-md w-full sm:w-1/2 md:w-1/3 cursor-pointer 
                backdrop-blur-sm border-gray-100 transition hover:scale-105 hover:shadow-lg hover:shadow-red-500
                ${selectedOption === 'volunteer' ? 'border-red-100 shadow-lg backdrop-blur-sm shadow-red-400' : 'border-gray-300 hover:shadow'}`}
                        onClick={() => setSelectedOption('volunteer')}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <User size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                            I'm a Volunteer
                        </h2>
                        <p className="text-gray-600 text-center">
                            Looking to make a difference? Find the perfect opportunity to share your time and skills.
                        </p>
                    </div>

                    {/* Organization Option */}
                    <div
                        className={`flex flex-col items-center p-6 sm:p-8 border rounded-md w-full sm:w-1/2 md:w-1/3 cursor-pointer 
                backdrop-blur-sm border-gray-100 transition hover:scale-105 hover:shadow-lg hover:shadow-red-500
                ${selectedOption === 'organization' ? 'border-red-100 shadow-lg backdrop-blur-sm shadow-red-400' : 'border-gray-300 hover:shadow'}`}
                        onClick={() => setSelectedOption('organization')}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <Building size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                            I'm an Organization
                        </h2>
                        <p className="text-gray-600 text-center">
                            Need helping hands for your cause? Connect with passionate volunteers and amplify your impact.
                        </p>
                    </div>
                </div>

                {/* Create Account Button */}
                <div className="flex justify-center mt-10">
                    <button
                        onClick={handleCreateAccount}
                        className={`py-3 px-8 rounded-md text-white font-bold transition 
                ${selectedOption ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-gray-400'}`}
                        disabled={!selectedOption}
                    >
                        Create Account
                    </button>
                </div>

                {/* Login Link */}
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
