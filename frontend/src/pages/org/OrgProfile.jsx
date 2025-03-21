import React from "react";
import { Link } from "react-router-dom";
import { Building2, Globe, Mail, Phone, MapPin, Star, Award, Users, Contact, X } from 'lucide-react';
import OrganizationDashboard from './OrganizationDashboard';
import { useUser } from '../../hooks/UserContext'; // Import the useUser hook

const OrgProfile = () => {
    const { user } = useUser(); // Access the user object from UserContext

    // Use the user object to populate the organization details
    const organization = {
        name: user?.name || "Organization Name",
        organizationType: user?.organization_type || "Organization Type",
        logo: user?.logo || "default-logo.png", // Default logo if none is provided
        websiteUrl: user?.website_url || "https://www.example.com",
        email: user?.email || "contact@example.com",
        contactNumber: user?.contact_number || "000 000 0000",
        address: user?.address || "123 Example Street, City, Country",
        about: user?.about || "This is a default description for the organization.",
        causesSupported: user?.causes_supported || ["Default Cause 1", "Default Cause 2"],
        impactMetrics: {
            volunteersEngaged: user?.volunteers_engaged || 0,
            projectsCompleted: user?.projects_completed || 0
        }
    };

    const events = user?.events || []; // Fetch events from the user object

    return (
        <OrganizationDashboard>
            {/* Error Pop-up */}
            <div className="fixed top-4 right-4 z-50">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
                    <span>Error message</span>
                    <button>
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-full min-h-screen">
                <div className="bg-white shadow-2xl overflow-hidden rounded-lg">
                    {/* Header Section with Gradient Overlay */}
                    <div className="relative rounded-lg text-gray-900 p-8 bg-red-100">
                        <div className="flex items-center relative z-10">
                            {/* Organization Logo */}
                            <div className="w-28 h-28 mx-10 rounded-full border-3 border-white shadow-lg overflow-hidden">
                                <img
                                    src={organization.logo}
                                    alt="Organization Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Organization Name */}
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    {organization.name}
                                </h1>
                                <p className="text-gray-800 text-sm flex items-center">
                                    <Star className="mr-2 w-4 h-4 text-orange-600" />
                                    {organization.organizationType}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3 p-4 sm:p-8">
                        {/* Volunteers Engaged */}
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 flex items-center transform hover:-translate-y-1 duration-300 group">
                            <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 sm:p-4 rounded-xl md:rounded-2xl mr-4 sm:mr-6 group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                                <Users size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                                    Volunteers Engaged
                                </p>
                                <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold">
                                    {organization.impactMetrics.volunteersEngaged}
                                </p>
                            </div>
                        </div>

                        {/* Projects Completed */}
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-6 flex items-center transform hover:-translate-y-1 duration-300 group">
                            <div className="bg-gradient-to-br from-red-100 to-red-200 p-3 sm:p-4 rounded-xl md:rounded-2xl mr-4 sm:mr-6 group-hover:from-red-200 group-hover:to-red-300 transition-colors">
                                <Award size={20} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                                    Projects Completed
                                </p>
                                <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold">
                                    {organization.impactMetrics.projectsCompleted}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* About and Contact Section */}
                    <div className="grid md:grid-cols-2 gap-8 px-8">
                        {/* About Section */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                <Building2 className="mr-3 text-orange-600" />
                                A bit about us
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {organization.about}
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                <Contact className="mr-3 text-orange-600" />
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                {[
                                    {
                                        icon: Globe,
                                        text: organization.websiteUrl,
                                        link: organization.websiteUrl
                                    },
                                    {
                                        icon: Mail,
                                        text: organization.email
                                    },
                                    {
                                        icon: Phone,
                                        text: organization.contactNumber
                                    },
                                    {
                                        icon: MapPin,
                                        text: organization.address
                                    }
                                ].map((contact, index) => (
                                    <div key={index} className="flex items-center group">
                                        <contact.icon className="mr-3 w-5 text-orange-700 flex-shrink-0 group-hover:text-orange-500 transition" />
                                        {contact.link ? (
                                            <a
                                                href={contact.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-orange-600 truncate"
                                            >
                                                {contact.text}
                                            </a>
                                        ) : (
                                            <span className="truncate">{contact.text}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Causes Supported */}
                    <div className="p-8 bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Causes supported by our organization
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {organization.causesSupported.map((cause) => (
                                <div
                                    key={cause}
                                    className="bg-gradient-to-br from-red-100 to-red-200 rounded-md md:rounded-lg shadow-md hover:shadow-lg transition-all p-2 sm:px-5 flex items-center transform hover:-translate-y-1 duration-300 group"
                                >
                                    {cause}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="p-4 sm:p-8">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Most recent events by us
                        </h1>
                        {/* Event Grid Container */}
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-7 py-4">
                            {events.map((event) => {
                                const eventDate = new Date(event.date);
                                const month = eventDate.toLocaleString("default", { month: "short" });
                                const day = eventDate.getDate();
                                return (
                                    <div
                                        key={event.id}
                                        className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white flex flex-col w-82 h-110 mx-auto"
                                    >
                                        {/* Date Box */}
                                        <div className="relative">
                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white text-center rounded-lg px-2 py-1">
                                                <span className="block text-sm font-semibold">{month}</span>
                                                <span className="block text-lg font-bold">{day}</span>
                                            </div>
                                        </div>
                                        {/* Image */}
                                        <img
                                            src={event.image_url}
                                            alt={event.event_name}
                                            className="w-full h-40 object-cover rounded-t-lg"
                                        />
                                        <div className="p-4 flex flex-col space-y-2">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {event.event_name}
                                            </h2>
                                            <p className="bg-orange-100 text-orange-500 font-medium px-2 py-1 rounded-xl inline-block w-fit">
                                                {event.category}
                                            </p>
                                            <p className="text-gray-600 text-sm">{event.city}</p>
                                            <p className="text-gray-600 text-sm">{event.date}</p>
                                            <p className="text-gray-500 text-sm">{event.description}</p>
                                            <div className="text-sm font-semibold text-orange-700 bg-red-50 px-2 py-1 my-2 rounded-lg w-fit">
                                                <Link
                                                    to={`/details/${event.event_id}`}
                                                    className="view-more-link"
                                                >
                                                    View More →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </OrganizationDashboard>
    );
};

export default OrgProfile;