import { useState, useEffect } from "react";
import eventBg from '../../assets/eventbackground.webp';
import axios from "axios";
import { useUser } from "../../hooks/UserContext"; // Import the user context
import { BadgeInfo, Brush, CloudRainWind, HeartPulse, PawPrint, Ribbon, School, SproutIcon, Users, X } from 'lucide-react';

const EventForm = () => {
    const { user } = useUser(); // Get the current user from context
    const [formData, setFormData] = useState({
        event_name: "",
        image_url: null,
        description: "",
        skills_required: "",
        category: [],
        date: "",
        time: "",
        venue: "",
        city: "",
        address: "",
        duration: "",
        volunteer_requirements: "",
        contact_email: "",
        contact_person_name: "",
        contact_person_number: "",
        registration_deadline: "",
        additional_notes: "",
        status: "",
        total_registered_volunteers: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [error, setError] = useState(null); // State for error messages

    const [categories, setCategories] = useState([
        { name: "Environmental", icon: <SproutIcon />, selected: false },
        { name: "Community Service", icon: <Users />, selected: false },
        { name: "Education", icon: <School />, selected: false },
        { name: "Healthcare", icon: <HeartPulse />, selected: false },
        { name: "Animal Welfare", icon: <PawPrint />, selected: false },
        { name: "Disaster Relief", icon: <CloudRainWind />, selected: false },
        { name: "Lifestyle & Culture", icon: <Brush />, selected: false },
        { name: "Fundraising & Charity", icon: <Ribbon />, selected: false }
    ]);

    const cityOptions = ["Colombo", "Galle", "Kandy"];

    const handleChange = (e) => {
        if (e.target.name === "image_url") {
            const file = e.target.files[0];
            setFormData({ ...formData, image_url: file });

            // Show preview of uploaded image
            if (file) {
                const reader = new FileReader();
                reader.onload = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleCategoryChange = (categoryName) => {
        // Update the selected state in the categories array
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.name === categoryName
                    ? { ...category, selected: !category.selected }
                    : category
            )
        );

        // Update the category state in formData
        setFormData(prevData => {
            const selectedCategories = prevData.category.includes(categoryName)
                ? prevData.category.filter(name => name !== categoryName)
                : [...prevData.category, categoryName];
            return { ...prevData, category: selectedCategories };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataToSend = new FormData();
        // For other fields
        Object.keys(formData).forEach((key) => {
            if (key !== 'category') {
                formDataToSend.append(key, formData[key]);
            }
        });

        // For categories - append each selected category separately
        formData.category.forEach(cat => {
            formDataToSend.append('category', cat);
        });

        // Add organization ID if available
        if (user && user.organization_id) {
            formDataToSend.append("organization_id", user.organization_id);
        }

        console.log("Sending this data:", formDataToSend);

        try {
            // Include the organization email in the header for authentication
            const headers = {
                "Content-Type": "multipart/form-data",
            };

            // If user exists and has an email, include it in the header
            if (user && user.email) {
                headers["X-Org-Email"] = user.email;
            }

            const response = await axios.post("http://127.0.0.1:8000/events", formDataToSend, {
                headers: headers
            });

            setMessage(response.data.message);
            setPreviewImage(null);

            // Reset form after successful submission
            setFormData({
                event_name: "",
                image_url: null,
                description: "",
                skills_required: "",
                category: [],
                date: "",
                time: "",
                venue: "",
                city: "",
                address: "",
                duration: "",
                volunteer_requirements: "",
                contact_email: "",
                contact_person_name: "",
                contact_person_number: "",
                registration_deadline: "",
                additional_notes: "",
                status: "",
                total_registered_volunteers: "",
            });

            // Reset categories
            setCategories(prevCategories =>
                prevCategories.map(category => ({ ...category, selected: false }))
            );

        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || "An error occurred while submitting the form.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null); // Clear the error message
    };

    // Check if user is logged in as an organization
    useEffect(() => {
        if (!user) {
            setError("You must be logged in as an organization to create events");
        } else if (user.role !== "organization") {
            setError("Only organizations can create events");
        }
    }, [user]);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-500 p-6">

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

            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${eventBg})` }}
            ></div>

            <div className="relative w-full md:w-[80%] lg:w-[70%] xl:w-[50%] mx-auto p-6 md:p-8 lg:p-10 bg-gray-50 shadow-lg rounded-lg mt-10">
                <h1 className="text-3xl font-bold  text-orange-700 ">PledgeIt</h1>
                <h2 className="text-2xl font-bold text-gray-700 pb-5 mt-2">Create an Event</h2>
                {message && <p className="text-green-600">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Name *</label>

                        <input type="text" name="event_name" value={formData.event_name} placeholder="Event Name" onChange={handleChange} required className="w-full p-2 border rounded" />
                        <div className="flex items-center gap-2 mt-2">
                            <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 ">Use specific, engaging, action-based titles to attract volunteers!</p>
                        </div>
                    </div>


                    {/* Image Upload Section */}
                    <label className="block text-gray-700 font-semibold">Upload Event Image:</label>
                    <input type="file" name="image_url" onChange={handleChange} required className="file-input w-full" />

                    {/* Image Preview */}
                    {previewImage && (
                        <div className="flex justify-center mt-4">
                            <img src={previewImage} alt="Preview" className="w-80 h-45 object-cover rounded-lg shadow-md border" />
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Description *</label>

                        <textarea name="description" value={formData.description} placeholder="What should volunteers know about the event?"
                            onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">What will volunteers do? *</label>
                        <input type="text" name="skills_required" value={formData.skills_required} placeholder="e.g., Distribute food packages, Assist in event setup"
                            onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Category * </label>
                        <p className="text-gray-500 mb-1">Only select one</p>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.name}
                                    onClick={() => handleCategoryChange(category.name)}
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
                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Date of the Event *</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Starting Time of the Event *</label>
                        <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Venue for the Event*</label>
                        <input type="text" name="venue" value={formData.venue} placeholder="Place where the event will be held" onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Location*</label>
                        <select
                            name="city"
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                            value={formData.city}
                        >

                            <option value="">Select a City</option>
                            {cityOptions.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Full Address *</label>

                        <input type="text" name="address" value={formData.address} placeholder="e.g.,57, Ramakrishna Road, Colombo 06, Sri Lanka"
                            onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Duration *</label>
                        <input type="text" name="duration" value={formData.duration} placeholder="e.g. 2 hours (Give in hours)" onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Volunteer count *</label>
                        <input type="text" name="volunteer_requirements" value={formData.volunteer_requirements} placeholder="Number of volunteers required" onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Contact Email *</label>
                        <input type="email" name="contact_email" value={formData.contact_email} placeholder="Contact Person Email" onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Name of the Contact Person *</label>
                        <input type="text" name="contact_person_name" value={formData.contact_person_name} placeholder="Contact Person Name" onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Contact number *</label>
                        <input type="text" name="contact_person_number" value={formData.contact_person_number} placeholder="Contact Person Number" onChange={handleChange} required className="w-full p-2 border rounded" />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Registration Deadline *</label>
                        <input type="date" name="registration_deadline" value={formData.registration_deadline} onChange={handleChange} required className="w-full p-2 border rounded" />
                        <div className="flex items-center gap-2 mt-2">
                            <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 "> Note that you can't reopen submission after deadline is passed.</p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Additional notes*</label>
                        <textarea name="additional_notes" value={formData.additional_notes} placeholder="Additional notes that might be worth mentioning" onChange={handleChange} className="w-full p-2 border rounded"></textarea>
                    </div>

                    <button type="submit" className="px-10 py-2 bg-red-600 text-white text-center py-2 rounded-lg hover:bg-red-700" disabled={loading || !user || user.role !== "organization"}>
                        {loading ? "Submitting..." : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventForm;