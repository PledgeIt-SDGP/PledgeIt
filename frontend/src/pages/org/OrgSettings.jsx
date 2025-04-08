import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import { BadgeInfo, Settings2, Building, Image, LogOut, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import OrganizationDashboard from "./OrganizationDashboard";

const VALID_CAUSES = [
    "Environmental",
    "Community Service",
    "Education",
    "Healthcare",
    "Animal Welfare",
    "Disaster Relief",
    "Lifestyle & Culture",
    "Fundraising & Charity"
];

const Settings = () => {
    const { user, setUser, refreshUser } = useUser();
    const [activeTab, setActiveTab] = useState("organization");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: user?.name || "",
        website_url: user?.website_url || "",
        organization_type: user?.organization_type || "",
        about: user?.about || "",
        contact_number: user?.contact_number || "",
        address: user?.address || "",
        causes_supported: user?.causes_supported || [],
        current_password: "",
        new_password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                setErrors({ ...errors, logo: "Only image files are allowed" });
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors({ ...errors, logo: "File size must be less than 5MB" });
                return;
            }

            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
            setErrors({ ...errors, logo: null });
        }
    };

    const handleCauseChange = (cause) => {
        const updatedCauses = formData.causes_supported.includes(cause)
            ? formData.causes_supported.filter((c) => c !== cause)
            : [...formData.causes_supported, cause];

        setFormData({ ...formData, causes_supported: updatedCauses });
    };

    const validateForm = () => {
        const newErrors = {};

        if (activeTab === "organization") {
            if (!formData.name) newErrors.name = "Organization name is required";
            if (!formData.website_url) newErrors.website_url = "Website URL is required";
            if (!formData.about) newErrors.about = "About section is required";
            if (!formData.contact_number) newErrors.contact_number = "Contact number is required";
            if (!formData.address) newErrors.address = "Address is required";
            if (formData.causes_supported.length === 0) newErrors.causes_supported = "At least one cause must be selected";
        }

        // Password validation if changing password
        if (formData.new_password || formData.password_confirmation) {
            if (!formData.current_password) newErrors.current_password = "Current password is required";
            if (formData.new_password.length < 8) newErrors.new_password = "Password must be at least 8 characters";
            if (formData.new_password !== formData.password_confirmation) {
                newErrors.password_confirmation = "Passwords do not match";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateOrganizationDetails = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("website_url", formData.website_url);
            formDataToSend.append("organization_type", formData.organization_type);
            formDataToSend.append("about", formData.about);
            formDataToSend.append("contact_number", formData.contact_number);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("causes_supported", JSON.stringify(formData.causes_supported));

            if (formData.new_password) {
                formDataToSend.append("current_password", formData.current_password);
                formDataToSend.append("password", formData.new_password);
                formDataToSend.append("password_confirmation", formData.password_confirmation);
            }

            if (e.target.image_url?.files[0]) {
                formDataToSend.append("logo", e.target.image_url.files[0]);
            }

            const response = await axios.put(
                "http://127.0.0.1:8000/auth/organization/update",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            await refreshUser();
            toast.success("Organization details updated successfully!");

            // Redirect to orgprofile page after successful update
            window.location.href = "/orgprofile";

        } catch (error) {
            console.error("Update failed:", error);
            toast.error(error.response?.data?.detail || "Failed to update organization details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            setUser(null);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }

        setIsLoading(true);
        try {
            await axios.delete(
                "http://127.0.0.1:8000/auth/organization/delete",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            setUser(null);
            toast.success("Account deleted successfully");
            window.location.href = "/"; // Redirect to home page after deletion
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error(error.response?.data?.detail || "Failed to delete account");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OrganizationDashboard>
            <div className="flex flex-col p-5 bg-gray-50 min-h-screen">
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
                        <form onSubmit={handleUpdateOrganizationDetails}>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">Current Password *</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    value={formData.current_password}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className={`w-full p-2 border rounded ${errors.current_password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.current_password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className={`w-full p-2 border rounded ${errors.new_password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.new_password && (
                                    <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>
                                )}
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className={`w-full p-2 border rounded ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>

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
                                <button
                                    onClick={() => handleDeleteAccount(true)}
                                    className="flex items-center bg-red-50 text-red-500 font-semibold border border-red-500 px-4 py-2 rounded hover:bg-red-50"
                                >
                                    <Trash2 size={18} className="mr-2" />
                                    Delete Account
                                </button>
                            </div>
                        </form>
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
                                <div className={`border-2 ${errors.logo ? 'border-red-500' : 'border-gray-300'} border-dashed p-4 rounded-lg text-center lg:w-[50%]`}>
                                    <p className="text-sm text-gray-500 mb-2">Upload here (PNG, JPG, max 5MB)</p>
                                    <input
                                        type="file"
                                        name="image_url"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="file-input w-full"
                                    />
                                    {errors.logo && (
                                        <p className="text-red-500 text-xs mt-2">{errors.logo}</p>
                                    )}
                                    {/* Image Preview */}
                                    {(previewImage || user?.logo) && (
                                        <div className="flex justify-center mt-4">
                                            <img
                                                src={previewImage || user?.logo}
                                                alt="Organization logo"
                                                className="w-32 h-32 object-cover rounded-full shadow-md border"
                                            />
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
                                        disabled
                                        className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-gray-100`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Website URL *</label>
                                    <input
                                        type="url"
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded ${errors.website_url ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="https://"
                                    />
                                    {errors.website_url && (
                                        <p className="text-red-500 text-xs mt-1">{errors.website_url}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Organization Type *</label>
                                    <select
                                        name="organization_type"
                                        value={formData.organization_type}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Select organization type</option>
                                        <option value="Private Business">Private Business</option>
                                        <option value="NGO">NGO</option>
                                        <option value="Educational Institution">Educational Institution</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">About Your Organization *</label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded ${errors.about ? 'border-red-500' : 'border-gray-300'}`}
                                        rows="4"
                                        placeholder="Write 1-2 paragraphs to share your mission, describe the work you do, and highlight the impact you make"
                                    />
                                    {errors.about && (
                                        <p className="text-red-500 text-xs mt-1">{errors.about}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={user?.email || ""}
                                        disabled
                                        className="w-full p-2 border rounded bg-gray-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded ${errors.contact_number ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.contact_number && (
                                        <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                        rows="2"
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-1">Causes Supported *</label>
                                    {errors.causes_supported && (
                                        <p className="text-red-500 text-xs mb-2">{errors.causes_supported}</p>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        {VALID_CAUSES.map((cause) => (
                                            <div key={cause} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={cause}
                                                    checked={formData.causes_supported.includes(cause)}
                                                    onChange={() => handleCauseChange(cause)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={cause}>{cause}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Organization Changes"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </OrganizationDashboard>
    );
};

export default Settings;