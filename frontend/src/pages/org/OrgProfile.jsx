import React from 'react';
import { Building2, Globe, Mail, Phone, MapPin, Star, Award, Users, HandHeart, Sparkle, Contact } from 'lucide-react';
import OrganizationDashboard from './OrganizationDashboard';

const OrgProfile = () => {
    const organization = {
        name: "Bla volunteers",
        organizationType: "Private Business",
        logo: "loginbackground.png",
        websiteUrl: "https://www.volunteer.org",
        email: "contact@volunteer.org",
        contactNumber: "071 123 4567",
        address: "123 Innovation Drive, Tech City, TC 12345",
        about: "TechCares Foundation is dedicated to bridging the digital divide by providing technology education and resources to underserved communities. We believe that access to technology is a fundamental right that can transform lives and create opportunities for personal and professional growth.",
        causesSupported: [
            "Education",
            "Community Service",
            "Technology Access"
        ],
        impactMetrics: {
            volunteersEngaged: 500,
            communityReach: 10000,
            projectsCompleted: 35
        }
    }

    return (
        <>
            <OrganizationDashboard>
                <div className="max-w-full min-h-screen p-5 ">
                    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                        {/* Header Section with Gradient Overlay */}
                        <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-8">
                            <div className="flex items-center relative z-10">
                                {/* Organization Logo */}
                                <div className="w-28 h-28 mr-6 rounded-full border-3 border-white shadow-lg overflow-hidden">
                                    {organization.logo ? (
                                        <img
                                            src={organization.logo}
                                            alt="Organization Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building2 className="w-full h-full text-gray-200 p-4" />
                                    )}
                                </div>

                                {/* Organization Name */}
                                <div>
                                    <h1 className="text-4xl font-bold mb-2">
                                        {organization.name}
                                    </h1>
                                    <p className="text-white/80 text-sm flex items-center">
                                        <Star className="mr-2 w-4 h-4 text-yellow-300" />
                                        {organization.organizationType}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Impact Metrics */}
                        <div className="grid grid-cols-3 bg-gray-100 p-4 text-center">
                            <div className="flex flex-col items-center">
                                <Users className="w-6 h-6 text-orange-600 mb-2" />
                                <span className="font-bold text-lg">{organization.impactMetrics.volunteersEngaged}</span>
                                <span className="text-xs text-gray-600">Volunteers Engaged</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Award className="w-6 h-6 text-orange-600 mb-2" />
                                <span className="font-bold text-lg">{organization.impactMetrics.projectsCompleted}</span>
                                <span className="text-xs text-gray-600">Projects Completed</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <MapPin className="w-6 h-6 text-orange-600 mb-2" />
                                <span className="font-bold text-lg">{organization.impactMetrics.communityReach}</span>
                                <span className="text-xs text-gray-600">Community Reach</span>
                            </div>
                        </div>

                        {/* About and Contact Section */}
                        <div className="grid md:grid-cols-2 gap-8 p-8">
                            {/* About Section */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center">
                                    <Building2 className="mr-3 text-orange-600" />
                                    About the Organization
                                </h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {organization.about}
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
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
                                Causes Supported
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {organization.causesSupported.map((cause) => (
                                    <div
                                        key={cause}
                                        className="flex items-center bg-gradient-to-l from-red-300 to-orange-300 text-black px-5 py-3 rounded-full text-sm transition"
                                    >
                                        <Sparkle className="mr-2 w-5 h-5 text-red-400" />
                                        {cause}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Events Section */}
                        <div className="p-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                                Recent Events
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map((event, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all group"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition">
                                            Digital Literacy Workshop
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Empowering local communities with essential digital skills and technology access.
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">September 15, 2023</span>
                                            <span className="text-gray-800 font-medium">09:00 AM</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </OrganizationDashboard>
        </>
    );
}

export default OrgProfile;