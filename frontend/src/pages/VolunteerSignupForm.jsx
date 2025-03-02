import React, { useState } from "react";


const VolunteerSignupForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


    };

    return (
        <div class="relative flex flex-col items-center justify-center min-h-screen pb-10 bg-gray-800">
            <div class="absolute inset-0 bg-[url('volbackground.jpg')] bg-cover bg-center opacity-20 "></div>

            <form onSubmit={handleSubmit} className="relative space-y-4 w-[90%] sm:w-160 bg-white rounded-lg px-5 sm:px-15 py-8 border border-gray-300 border-opacity-50 my-15">
                <div className="mb-3 text-center">
                    <h1 className="text-3xl font-bold text-orange-700">PledgeIt</h1>
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Create your personal account</h2>
                </div>



                {error && <p className="text-red-600 text-center">{error}</p>} {/* Show errors */}

                {/* Social Login Buttons */}
                <div className="flex flex-col items-center justify-center mx-30">
                    <button className="w-full flex items-center justify-center py-2 border rounded-lg text-gray-600 hover:bg-gray-100">
                        <img
                            src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                            alt="Google"
                            className="h-5 mr-3"
                        />
                        Continue with Google
                    </button>
                </div>

                {/* Divider */}
                <div className="my-8 flex items-center justify-center w-full">
                    <hr className="flex-grow border-t" />
                    <span className="px-2 text-gray-500">OR</span>
                    <hr className="flex-grow border-t" />
                </div>
                <div className="flex gap-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">First Name *</label>
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Last Name *</label>
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-600 mb-1">Email Address *</label>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                </div>


                <div className="flex gap-x-4">
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Password *</label>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-600 mb-1">Confirm Password *</label>
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200" />
                    </div>
                </div>

                <button type="submit" className="w-full mt-5 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-blue-200">
                    Create Account
                </button>


            </form>
        </div>
    );
};

export default VolunteerSignupForm;