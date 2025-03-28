import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import { BadgeInfo, Settings2, Building, Image, LogOut, Trash2, X } from "lucide-react";
import OrganizationDashboard from "./OrganizationDashboard";

const Settings = () => {
    const { user, setUser } = useUser(); // Access user context
    const [activeTab, setActiveTab] = useState("account");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        website_url: user?.website_url || "",
        organization_type: user?.organization_type || "",
        about: user?.about || "",
        contact_number: user?.contact_number || "",
        address: user?.address || "",
        causes_supported: user?.causes_supported || [],
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateOrganizationDetails = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("website_url", formData.website_url);
        formDataToSend.append("organization_type", formData.organization_type);
        formDataToSend.append("about", formData.about);
        formDataToSend.append("contact_number", formData.contact_number);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("causes_supported", JSON.stringify(formData.causes_supported));
        if (formData.password) {
            formDataToSend.append("password", formData.password);
            formDataToSend.append("password_confirmation", formData.password_confirmation);
        }
        if (e.target.image_url.files[0]) {
            formDataToSend.append("logo", e.target.image_url.files[0]);
        }

        try {
            const response = await axios.put(
                "https://pledgeit-backend-production-production.up.railway.app/auth/organization/update",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Organization details updated:", response.data);

            // Update the user context with the new details
            setUser((prevUser) => ({
                ...prevUser,
                ...formData,
                logo: previewImage || prevUser.logo, // Update logo if a new one was uploaded
            }));

            alert("Organization details updated successfully!");
        } catch (error) {
            console.error("Failed to update organization details:", error);
            alert("Failed to update details. Please try again.");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "https://pledgeit-backend-production-production.up.railway.app/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            setUser(null); // Clear user context
            window.location.href = "/"; // Redirect to login page
        } catch (error) {
            console.error("Failed to logout:", error);
            alert("Failed to logout. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await axios.delete(
                    "https://pledgeit-backend-production-production.up.railway.app/auth/organization/delete",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                localStorage.removeItem("token");
                localStorage.removeItem("userRole");
                setUser(null); // Clear user context
                window.location.href = "/"; // Redirect to login page
            } catch (error) {
                console.error("Failed to delete account:", error);
                alert("Failed to delete account. Please try again.");
            }
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
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="New Password"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                                Update Password
                            </button>
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

                        <form onSubmit={handleUpdateOrganizationDetails}>
                            {/* Organization Logo */}
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">ORGANIZATION LOGO</label>
                                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center lg:w-[50%]">
                                    <p className="text-sm text-gray-500 mb-2">Upload here*</p>
                                    <input
                                        type="file"
                                        name="image_url"
                                        onChange={handleFileChange}
                                        className="file-input w-full"
                                    />
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
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Website Url *</label>
                                    <input
                                        type="text"
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        placeholder="https://"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">About Your Organization *</label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        rows="4"
                                        placeholder="Write 1-2 paragraphs to share your mission, describe the work you do, and highlight the impact you make"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        rows="2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Causes Supported *</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Environmental", "Community Service", "Education", "Healthcare", "Animal Welfare", "Disaster Relief", "Lifestyle & Culture", "Fundraising & Charity"].map((cause) => (
                                            <div key={cause} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={cause}
                                                    name="causes_supported"
                                                    checked={formData.causes_supported.includes(cause)}
                                                    onChange={(e) => {
                                                        const updatedCauses = e.target.checked
                                                            ? [...formData.causes_supported, cause]
                                                            : formData.causes_supported.filter((c) => c !== cause);
                                                        setFormData({ ...formData, causes_supported: updatedCauses });
                                                    }}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={cause}>{cause}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                                Save Organization Changes
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </OrganizationDashboard>
    );
};

export default Settings;