import React from "react";
import { BadgeInfo, Settings2 } from "lucide-react";
import OrganizationDashboard from "../../pages/OrganizationDashboard";


const Settings = () => {
    return (
        <OrganizationDashboard>
            <div className="flex flex-col  p-5 bg-gray-50">

                <h1 className="text-2xl font-bold m-8">Settings</h1>
                
                {/* Profile Section */}
                <div className="bg-white shadow-md rounded-lg p-5 mb-5 w-[60%]">
                    <h2 className="text-lg font-bold mb-3">Profile</h2>
                    <div className="flex items-center mb-3">
                        <BadgeInfo size={18} className="mr-2" />
                        <p className="text-sm text-gray-500">Manage your profile information.</p>
                    </div>
                    <form>
                        <div className="mb-5">
                            <label className="block text-gray-700 mb-1">Name</label>
                            <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input type="email" placeholder="your@email.com" className="w-full p-2 border rounded" />
                        </div>
                        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Save Changes</button>
                    </form>
                </div>

                {/* Account Settings Section */}
                <div className="bg-white shadow-md rounded-lg p-5 mb-5 w-[60%]">
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
                </div>

                {/* Notification Preferences Section */}
                <div className="bg-white shadow-md rounded-lg p-5 w-[60%]">
                    <h2 className="text-lg font-bold mb-3">Notification Preferences</h2>
                    <div className="flex items-center mb-3">
                        <BadgeInfo size={18} className="mr-2" />
                        <p className="text-sm text-gray-500">Customize your notification settings.</p>
                    </div>
                    <form>
                        <div className="mb-5">
                            <label className="block text-gray-700 mb-1">Email Notifications</label>
                            <input type="checkbox" className="mr-2" />
                            <span>Receive email notifications for new events.</span>
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-700 mb-1">Push Notifications</label>
                            <input type="checkbox" className="mr-2" />
                            <span>Enable push notifications for updates.</span>
                        </div>
                        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Save Preferences</button>
                    </form>
                </div>
            </div>
        </OrganizationDashboard>
    );
};

export default Settings;
