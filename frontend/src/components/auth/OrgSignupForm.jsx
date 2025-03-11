import React, { useState } from 'react';
// import axios from "axios";
import { BadgeInfo, Brush, CloudRainWind, HeartPulse, PawPrint, Ribbon, School, SproutIcon, Users } from 'lucide-react';

const categories = [
    { id: 1, name: "Environmental", icon: <SproutIcon />, selected: false },
    { id: 2, name: "Community Service", icon: <Users />, selected: false },
    { id: 3, name: "Education", icon: <School />, selected: false },
    { id: 4, name: "Healthcare", icon: <HeartPulse />, selected: false },
    { id: 5, name: "Animal Welfare", icon: <PawPrint />, selected: false },
    { id: 6, name: "Disaster Relief", icon: <CloudRainWind />, selected: false },
    { id: 7, name: "Lifestyle & Culture", icon: <Brush />, selected: false },
    { id: 8, name: "Fundraising & Charity", icon: <Ribbon />, selected: false }
];

const OrganizationType = [
    { value: 'Private Business', label: 'Private Business', description: 'Running a company but want to give back? Many businesses launch CSR (Corporate Social Responsibility) initiatives or encourage employees to volunteer. If your company organizes charity events, donation drives, or environmental clean-ups, this is for you!' },
    { value: 'NGO', label: 'NGO', description: 'Passionate about making a difference? NGOs focus on causes like poverty relief, education, healthcare, and environmental conservation. If your organization relies on volunteers to create real impact, this is your category!' },
    { value: 'Educational Institution', label: 'Educational Institution', description: 'Schools, universities, or training centers that encourage students to volunteer. Whether it’s organizing community outreach programs, student-led projects, or academic service-learning, this is where you belong!' },
    { value: 'Other', label: 'Other', description: 'Don’t fit into these categories? No worries! Whether you’re a government entity, a cultural institution, a community-based group, or any other organization driving positive change through volunteering, this is your space!' },
];

const OrgSignupForm = () => {
    const [orgLogo, setOrgLogo] = useState(null);
    const [orgName, setOrgName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [orgType, setOrgType] = useState('Private Business');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [address, setAddress] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [categoriesState, setCategoriesState] = useState(categories);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState('');


    const handleLogoChange = (e) => {
        setOrgLogo(e.target.files[0]);
    };

    const handleCategoryChange = (id) => {
        setCategoriesState(prevCategories =>
            prevCategories.map(category =>
                category.id === id ? { ...category, selected: !category.selected } : category
            )
        );
        setSelectedCategories(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(catId => catId !== id)
                : [...prevSelected, id]
        );
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password && e.target.value !== password) {
            setPasswordError("Passwords do not match.");
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!orgLogo) {
            setMessage("Please upload an organization logo.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            setLoading(false);
            return;
        } else {
            setPasswordError('');
        }

        const formDataToSend = new FormData();
        formDataToSend.append('logo', orgLogo);  // Backend expects 'logo'
        formDataToSend.append('name', orgName);  // Match FastAPI field names
        formDataToSend.append('website_url', websiteUrl);
        formDataToSend.append('organization_type', orgType);
        formDataToSend.append('about', description);
        formDataToSend.append('email', email);
        formDataToSend.append('contact_number', contactNumber);
        formDataToSend.append('address', address);

        // Convert selected category names to an array (not IDs)
        categoriesState.forEach(category => {
            if (category.selected) {
                formDataToSend.append('causes_supported', category.name);
            }
        });

        formDataToSend.append('password', password);
        formDataToSend.append('password_confirmation', confirmPassword);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/auth/organization/register", // Correct API URL
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.detail || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="relative flex flex-col items-center justify-center min-h-screen pb-10 bg-gray-800">

                <div className="absolute inset-0 bg-[url('orgbackground.jpg')] bg-cover bg-center opacity-20 "></div>

                <form onSubmit={handleSubmit} className="relative space-y-4 w-[90%] sm:w-180 bg-gray-50 rounded-lg px-5 sm:px-10 py-8 border border-gray-300 border-opacity-50 my-20 ">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold  text-orange-700 ">PledgeIt</h1> {/* Title and Info Section */}

                        <h2 className="text-2xl font-bold text-gray-700 pb-5 mt-2">Create an Organization account</h2>
                    </div>
                    <div className="flex items-center space-x-4 my-5">
                        <div className="relative w-25 h-25 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-200 overflow-hidden cursor-pointer">
                            {orgLogo ? (
                                <img
                                    src={URL.createObjectURL(orgLogo)}
                                    alt="Logo"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <span className="text-3xl text-gray-600">+</span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                            />
                        </div>
                        <div>
                            <p className="font-bold">ORGANIZATION LOGO</p>
                            <label className="block text-gray-600">Upload here*</label>
                        </div>
                    </div>

                    <div>
                        <p className="font-bold my-6">ORGANIZATION DETAILS</p>

                        <label className="block text-gray-600 mb-1">Organization Name *</label>
                        <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Organization Name"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Website Url *</label>
                        <input
                            type="url"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="ex: https://volunteers.org/"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>


                    <div>
                        <label className="block text-gray-600 mb-3">Organization Type *</label>

                        <div className="container flex items-start space-x-8">
                            {/* Organization Type Options */}
                            <div className="organization-options  w-[30%] flex flex-col space-y-4">
                                {OrganizationType.map((type) => (
                                    <div
                                        key={type.value}
                                        className={`flex items-center border-2 rounded-lg p-2 cursor-pointer transition 
                                        ${orgType === type.value ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
                                        onClick={() => setOrgType(type.value)}
                                    >

                                        <input
                                            type="radio"
                                            name="orgType"
                                            id={type.value}
                                            value={type.value}
                                            checked={orgType === type.value}
                                            onChange={() => setOrgType(type.value)}
                                            className="mr-2 hidden"
                                        />
                                        <label htmlFor={type.value} className="cursor-pointer w-full flex items-center">
                                            {type.label}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Organization Type Description */}
                            <div className="organization-description flex-1 bg-red-50 border rounded-lg border-gray-200 p-5">

                                {orgType && (
                                    <p className="text-sm text-gray-800 p-5">
                                        <strong>PledgeIT for {orgType}:</strong> {OrganizationType.find(type => type.value === orgType)?.description}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">About Your Organization *</label>
                        <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="block p-2.5 w-full text-sm text-black-900 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none" placeholder="Write your thoughts here..."></textarea>
                        <div className="flex items-center gap-2">
                            <BadgeInfo /><p className="text-sm block text-gray-500 mt-1 ">Write 1-2 paragraphs to share your mission, describe the work you do, and highlight the impact you make</p>
                        </div>
                    </div>


                    <div>
                        <label className="block text-gray-600 mb-1">Email Address *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., volunteer@gmail.com"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Contact Number *</label>
                        <input
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g., 0711234567"
                            maxLength={10}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 mb-1">Address *</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g., 57, Ramakrishna Road, Colombo 06, Sri Lanka"
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-600 mb-5">Causes Supported *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {categoriesState.map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`flex flex-col items-center justify-center w-auto p-5 border rounded-xl shadow-md cursor-pointer 
                                        ${category.selected ? "border-orange-400 bg-red-100" : "border-red-600/90 bg-white"} transition`}
                                >
                                    <div className="flex items-center">
                                        {category.icon}
                                        <span className="ml-2">{category.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-gray-700 font-medium mb-2">Password *</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter a secure password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    minLength="8"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-gray-700 font-medium mb-2">Confirm Password *</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirm your password"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                        )}


                        <div className="flex items-start gap-2 text-sm text-gray-600">
                            <BadgeInfo className="mt-1" />
                            <p>Use at least 8 characters with a mix of letters, numbers, and symbols.</p>
                        </div>
                    </div>


                    {loading ? (
                        <button type="submit" disabled className="inline-flex items-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-base font-medium text-white shadow-sm">
                            Loading...
                        </button>
                    ) : (
                        <button type="submit" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 my-5 text-base font-medium text-white shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer">
                            Create your account
                        </button>
                    )}
                    {message && <div className="text-red-500 mt-2">{message}</div>}
                </form>
            </div>
        </>
    );
}

export default OrgSignupForm;