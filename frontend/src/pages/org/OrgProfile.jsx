import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Building2,
    Globe,
    Mail,
    Phone,
    MapPin,
    Star,
    Award,
    Users,
    Contact,
    Calendar,
    ChevronRight,
    Plus
} from 'lucide-react';
import OrganizationDashboard from './OrganizationDashboard';
import { useUser } from '../../hooks/UserContext';
import axios from "axios";
import { format, parseISO } from 'date-fns';

const OrgProfile = () => {
    const { user } = useUser();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const organization = {
        name: user?.name || "Organization Name",
        organizationType: user?.organization_type || "Organization Type",
        logo: user?.logo || "https://source.unsplash.com/random/200x200/?logo",
        websiteUrl: user?.website_url || "https://www.example.com",
        email: user?.email || "contact@example.com",
        contactNumber: user?.contact_number || "000 000 0000",
        address: user?.address || "123 Example Street, City, Country",
        about: user?.about || "This organization hasn't provided a description yet. We're passionate about making a difference in our community through volunteer efforts and social initiatives.",
        causesSupported: user?.causes_supported || ["Environment", "Education", "Community Development"],
        impactMetrics: {
            volunteersEngaged: user?.volunteers_engaged || 0,
            projectsCompleted: user?.projects_completed || 0,
            hoursContributed: user?.hours_contributed || 0
        }
    };

    const cleanCauses = organization.causesSupported
        .join(',')
        .replace(/[\[\]\\"]/g, '')
        .split(',')
        .map(cause => cause.trim())
        .filter((cause, index, self) => cause && self.indexOf(cause) === index);

    useEffect(() => {
        const fetchOrganizationEvents = async () => {
            try {
                if (!user || user.role !== "organization") return;

                const response = await axios.get(
                    "https://pledgeit-backend-ihkh.onrender.com/organization/events",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                setEvents(response.data);
            } catch (err) {
                setError(err.message || "Error loading events");
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizationEvents();
    }, [user]);

    return (
        <OrganizationDashboard>
            <div className="max-w-full min-h-screen">
                {/* Profile Header */}
                <div className="relative bg-red-100 rounded-t-xl overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                <img
                                    src={organization.logo}
                                    alt="Organization Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://source.unsplash.com/random/200x200/?logo";
                                    }}
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {organization.name}
                                </h1>
                                <div className="inline-flex items-center bg-white px-3 py-1 rounded-full shadow-sm">
                                    <Star className="mr-2 w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {organization.organizationType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Impact Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <MetricCard
                            icon={Users}
                            title="Volunteers Engaged"
                            value={organization.impactMetrics.volunteersEngaged.toLocaleString()}
                            color="orange"
                        />
                        <MetricCard
                            icon={Award}
                            title="Projects Completed"
                            value={organization.impactMetrics.projectsCompleted.toLocaleString()}
                            color="red"
                        />
                        <MetricCard
                            icon={Calendar}
                            title="Hours Contributed"
                            value={organization.impactMetrics.hoursContributed.toLocaleString()}
                            color="pink"
                        />
                    </div>

                    {/* About and Contact Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <InfoSection
                            icon={Building2}
                            title="About Our Organization"
                            content={organization.about}
                        />
                        <InfoSection
                            icon={Contact}
                            title="Contact Information"
                            items={[
                                { icon: Globe, text: organization.websiteUrl, link: organization.websiteUrl },
                                { icon: Mail, text: organization.email, link: `mailto:${organization.email}` },
                                { icon: Phone, text: organization.contactNumber, link: `tel:${organization.contactNumber}` },
                                { icon: MapPin, text: organization.address, link: `https://maps.google.com/?q=${encodeURIComponent(organization.address)}` }
                            ]}
                        />
                    </div>

                    {/* Causes Supported */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Star className="mr-2 text-orange-500" />
                                Causes We Support
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {cleanCauses.length > 0 ? (
                                cleanCauses.map((cause, index) => (
                                    <CauseTag key={index} cause={cause} />
                                ))
                            ) : (
                                <p className="text-gray-500">No causes specified yet</p>
                            )}
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <Calendar className="mr-2 text-orange-500" />
                                Our Recent Events
                            </h2>
                            <Link to="/orgevents" className="text-sm text-orange-600 hover:text-orange-700 flex items-center">
                                View all events <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            Error loading events: {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.slice(0, 3).map((event) => (
                                    <EventCard key={event.event_id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                                    <Calendar className="w-full h-full" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                                <p className="text-gray-500 mb-4">Get started by creating your first volunteer event</p>
                                <Link
                                    to="/eventform"
                                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Event
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </OrganizationDashboard>
    );
};

// Reusable components
const MetricCard = ({ icon: Icon, title, value, color = "orange" }) => {
    const colorClasses = {
        orange: "from-orange-100 to-orange-200 text-orange-600",
        red: "from-red-100 to-red-200 text-red-600",
        pink: "from-pink-100 to-pink-200 text-pink-600"
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center">
            <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-lg mr-4`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};

const InfoSection = ({ icon: Icon, title, content, items }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Icon className="mr-2 text-orange-500" />
            {title}
        </h2>
        {content ? (
            <p className="text-gray-700 leading-relaxed">{content}</p>
        ) : (
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start">
                        <item.icon className="mt-0.5 mr-3 w-4 h-4 text-orange-500 flex-shrink-0" />
                        {item.link ? (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-orange-600 break-words"
                            >
                                {item.text}
                            </a>
                        ) : (
                            <span className="text-gray-700 break-words">{item.text}</span>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
);

const CauseTag = ({ cause }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
        {cause}
    </span>
);

const EventCard = ({ event }) => {
    const eventDate = parseISO(event.date);
    const month = format(eventDate, "MMM");
    const day = format(eventDate, "d");
    const formattedDate = format(eventDate, "MMM d, yyyy");

    return (
        <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden flex flex-col h-full">
            {/* Date Ribbon */}
            <div className="relative h-40 bg-gray-200 overflow-hidden">
                <img
                    src={event.image_url || "https://source.unsplash.com/random/600x400/?volunteer"}
                    alt={event.event_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = "https://source.unsplash.com/random/600x400/?volunteer";
                    }}
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-center rounded-lg w-14 p-1">
                    <span className="block text-xs font-semibold uppercase tracking-wide">
                        {month}
                    </span>
                    <span className="block text-xl font-bold leading-none">
                        {day}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            {event.event_name}
                        </h2>
                    </div>

                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold mb-3">
                        {event.category}
                    </span>

                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.city}
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formattedDate}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                    </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {event.total_registered_volunteers} registered
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            to={`/details/${event.event_id}`}
                            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgProfile;