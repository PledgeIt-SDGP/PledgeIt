import React, { useState } from 'react';
import { Info } from 'lucide-react';

const OrgType = ({ orgType, setOrgType }) => {
    const handleChange = (e) => {
        setOrgType(e.target.value);
    };

    return (
        <div className="container flex items-start space-x-6">
            <div className="organization-options flex flex-col space-y-4 ">
                <div
                    className={`flex items-center border-2 rounded-lg p-2 ${orgType === 'Private Business' ? "border-red-300" : "border-gray-300"}`}
                >
                    <input
                        type="radio"
                        id="business"
                        name="organizationType"
                        value="Private Business"
                        checked={orgType === 'Private Business'}
                        onChange={handleChange}
                        className="mr-2"
                        
                    />

                    <label htmlFor="business">Private Business</label>
                </div>

                <div
                    className={`flex items-center border-2 rounded-lg p-2 ${orgType === 'Nonprofit' ? "border-red-300" : "border-gray-300"}`}
                >
                    <input
                        type="radio"
                        id="nonprofit"
                        name="organizationType"
                        value="Nonprofit"
                        checked={orgType === 'Nonprofit'}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="nonprofit">Non-profit</label>
                </div>

                <div
                    className={`flex items-center border-2 rounded-lg p-2 ${orgType === 'Educational Institution' ? "border-red-300" : "border-gray-300"}`}
                >
                    <input
                        type="radio"
                        id="educational"
                        name="organizationType"
                        value="Educational Institution"
                        checked={orgType === 'Educational Institution'}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="educational">Educational Institution</label>
                </div>

                <div
                    className={`flex items-center border-2 rounded-lg p-2 ${orgType === 'Other' ? "border-red-300" : "border-gray-300"}`}
                >
                    <input
                        type="radio"
                        id="other"
                        name="organizationType"
                        value="Other"
                        checked={orgType === 'Other'}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label htmlFor="other">Other</label>
                </div>
            </div>

            <div className="organization-description flex-1 bg-gray-100 border-1 rounded-lg border-gray-200 p-5">
                <Info opacity={0.5} color='red' size={18}/>
                {orgType === 'Nonprofit' && (
                    <p className='text-sm text-gray-800 pt-4'>
                        <strong>PledgeIT for Nonprofits:</strong> If your organization is a nonprofit, social service, or charity-based organization that relies on volunteers to help fulfill its mission, you should choose this category. Nonprofits often use volunteering platforms to recruit, manage, and coordinate volunteers for community service projects, fundraising, and outreach programs.
                    </p>
                )}

                {orgType === 'Private Business' && (
                    <p className='text-sm text-gray-800 pt-4'>
                        <strong>PledgeIT for Private Businesses:</strong> If your organization is a for-profit business and you want to engage your employees or customers in volunteering activities, you would select this category. Many private businesses use volunteering as a way to give back to the community, build team spirit, or promote social responsibility.
                    </p>
                )}

                {orgType === 'Educational Institution' && (
                    <p className='text-sm text-gray-800 pt-4'>
                        <strong>PledgeIT for Educational Institutions:</strong> If your organization is a school, university, or educational institution looking to involve students, faculty, and staff in volunteer opportunities, this is the category for you. Educational institutions often seek volunteer activities that align with student development, social responsibility, or academic service-learning projects.
                    </p>
                )}

                {orgType === 'Other' && (
                    <p className='text-sm text-gray-800 pt-4'>
                        <strong>PledgeIT for Other Organizations:</strong> If your organization does not fall under the above categories but still wants to organize volunteer events, you may choose this category. This can include government organizations, cultural institutions, professional associations, or community-based groups that need volunteers for various causes.
                    </p>
                )}
            </div>
        </div>
    );
};

export default OrgType;
