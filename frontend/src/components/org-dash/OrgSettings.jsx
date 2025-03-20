import React, { useState } from "react";
import { BadgeInfo, Settings2, Building, Image, LogOut, Trash2, X } from "lucide-react";
import OrganizationDashboard from "../../pages/OrganizationDashboard";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("account");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null); // State for error messages

    const handleLogout = () => {
        try {
            // Implement your logout logic here
            console.log("Logging out...");
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        } catch (error) {
            setError("An error occurred during logout. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // Implement your account deletion logic here
            console.log("Deleting account...");
            // Example: API call to delete the account
            // await axios.delete("/api/account");
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        } catch (error) {
            setError("An error occurred while deleting your account. Please try again.");
        }
    };

    const handleChange = (e) => {
        try {
            if (e.target.name === "image_url") {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setPreviewImage(reader.result);
                    reader.readAsDataURL(file);
                }
            }
        } catch (error) {
            setError("An error occurred while uploading the image. Please try again.");
        }
    };

    const handleCloseError = () => {
        setError(null); // Clear the error message
    };

    return (
        <OrganizationDashboard>
            {/* Error Pop-up */}
            {error && (
                <div className="fixed top-4 right-4 z-50">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={handleCloseError} className="ml-4">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col p-5 bg-gray-50">
                <h1 className="text-2xl font-bold m-8">Settings</h1>

                <div className="mb-6">
                    <div className="flex space-x-4 border-b">
                        <button
                            className={`px-4 py-2 ${activeTab === "account" ? "border-b-2 border-red-500 font-semibold" : "text-gray-500"}`}
                            onClick={() => setActiveTab("account")}
                        >
                            Account Settings
                        </button>

                        <button
                            className={`px-4 py-2 ${activeTab === "organization" ? "border-b-2 border-red-500 font-semibold" : "text-gray-500"}`}
                            onClick={() => setActiveTab("organization")}
                        >
                            Organization Details
                        </button>
                    </div>
                </div>

                {/* Account Settings Section */}
                {activeTab === "account" && (
                    <div className="bg-white shadow-md rounded-lg p-5 mb-5">
                        <h2 className="text-lg font-bold mb-3">Account Settings</h2>
                        <div className="flex items-center mb-3">
                            <Settings2 size={18} className="mr-2" />
                            <p className="text-sm text-gray-500">Manage your account preferences.</p>
                        </div>
                        <form>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">Password</label>
                                <input type="password" placeholder="New Password" className="w-full p-2 border rounded" />
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">Confirm Password</label>
                                <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded" />
                            </div>
                            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Update Password</button>
                        </form>

                        {/* Logout Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Account Access</h3>
                            <button
                                onClick={handleLogout}
                                className="flex items-center bg-red-500 text-red-50 px-4 py-2 rounded hover:bg-red-700 mb-4"
                            >
                                <LogOut size={18} className="mr-2" />
                                Log Out
                            </button>

                            {/* Delete Account Button */}
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center bg-red-50 text-red-500 font-semibold border border-red-500 px-4 py-2 rounded hover:bg-red-50"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    Delete Account
                                </button>
                            ) : (
                                <div className="bg-red-50 p-4 rounded border border-red-200">
                                    <p className="text-sm text-red-700 mb-3">Are you sure you want to delete your account? This action cannot be undone.</p>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Yes, Delete Account
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Organization Settings Section */}
                {activeTab === "organization" && (
                    <div className="bg-white shadow-md rounded-lg p-5">
                        <h2 className="text-lg font-bold mb-3">Organization Settings</h2>
                        <div className="flex items-center mb-3">
                            <Building size={18} className="mr-2" />
                            <p className="text-sm text-gray-500">Manage your organization details and information.</p>
                        </div>

                        <form>
                            {/* Organization Logo */}
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">ORGANIZATION LOGO</label>
                                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center lg:w-[50%]">
                                    <p className="text-sm text-gray-500 mb-2">Upload here*</p>

                                    <input type="file" name="image_url" onChange={handleChange} className="file-input w-full" />


                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="flex justify-center mt-4">
                                            <img src={previewImage} alt="Preview" className="w-45 h-45 object-cover rounded-full shadow-md border" />
                                        </div>
                                    )}


                                </div>
                            </div>

                            {/* Organization Details */}
                            <div className="mb-5">
                                <h3 className="font-semibold text-gray-700 mb-3">ORGANIZATION DETAILS</h3>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Organization Name *</label>
                                    <input type="text" className="w-full p-2 border rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Website Url *</label>
                                    <input type="text" className="w-full p-2 border rounded" placeholder="https://" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">About Your Organization *</label>
                                    <textarea
                                        className="w-full p-2 border rounded"
                                        rows="4"
                                        placeholder="Write 1-2 paragraphs to share your mission, describe the work you do, and highlight the impact you make"
                                    ></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Email Address *</label>
                                    <input type="email" className="w-full p-2 border rounded" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Contact Number *</label>
                                    <input type="tel" className="w-full p-2 border rounded" />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Address *</label>
                                    <textarea className="w-full p-2 border rounded" rows="2"></textarea>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Causes Supported *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Environmental", "Community Service", "Education", "Healthcare", "Animal Welfare", "Disaster Relief", "Lifestyle & Culture", "Fundraising & Charity"].map((cause) => (
                                            <div key={cause} className="flex items-center">
                                                <input type="checkbox" id={cause} className="mr-2" />
                                                <label htmlFor={cause}>{cause}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Save Organization Changes</button>
                        </form>
                    </div>
                )}
            </div>
        </OrganizationDashboard>
    );
};

export default Settings;