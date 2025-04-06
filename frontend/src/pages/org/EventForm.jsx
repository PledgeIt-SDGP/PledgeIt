import { useState, useEffect } from "react";
import eventBg from '../../assets/eventbackground.webp';
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import { BadgeInfo, Brush, CloudRainWind, HeartPulse, PawPrint, Ribbon, School, SproutIcon, Users, X, CheckCircle } from 'lucide-react';

const EventForm = () => {
    const { user } = useUser();
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

    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

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

    const validateForm = () => {
        const errors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Required fields validation
        if (!formData.event_name.trim()) errors.event_name = "Event name is required";
        if (!formData.image_url) errors.image_url = "Event image is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        if (!formData.date) errors.date = "Event date is required";
        if (!formData.time) errors.time = "Event time is required";
        if (!formData.venue.trim()) errors.venue = "Venue is required";
        if (!formData.city) errors.city = "City is required";
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.duration.trim()) errors.duration = "Duration is required";
        if (!formData.volunteer_requirements) errors.volunteer_requirements = "Volunteer count is required";
        if (!formData.contact_email.trim()) errors.contact_email = "Contact email is required";
        if (!formData.contact_person_name.trim()) errors.contact_person_name = "Contact person name is required";
        if (!formData.contact_person_number.trim()) errors.contact_person_number = "Contact number is required";
        if (!formData.registration_deadline) errors.registration_deadline = "Registration deadline is required";
        if (formData.category.length === 0) errors.category = "Please select at least one category";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.contact_email && !emailRegex.test(formData.contact_email)) {
            errors.contact_email = "Please enter a valid email address";
        }

        // Date validation
        if (formData.date && new Date(formData.date) < today) {
            errors.date = "Event date cannot be in the past";
        }

        if (formData.registration_deadline && new Date(formData.registration_deadline) < today) {
            errors.registration_deadline = "Deadline cannot be in the past";
        }

        if (formData.date && formData.registration_deadline && new Date(formData.registration_deadline) > new Date(formData.date)) {
            errors.registration_deadline = "Deadline must be before event date";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        if (e.target.name === "image_url") {
            const file = e.target.files[0];
            if (file) {
                // Validate image file
                if (!file.type.match('image.*')) {
                    setMessage({ text: "Please upload an image file (JPEG, PNG, etc.)", type: "error" });
                    return;
                }
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    setMessage({ text: "Image size should be less than 5MB", type: "error" });
                    return;
                }
                setFormData({ ...formData, image_url: file });

                // Show preview
                const reader = new FileReader();
                reader.onload = () => setPreviewImage(reader.result);
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
        // Clear validation error when field is edited
        if (validationErrors[e.target.name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const handleCategoryChange = (categoryName) => {
        setCategories(prevCategories =>
            prevCategories.map(category => ({
                ...category,
                selected: category.name === categoryName ? !category.selected : false
            }))
        );

        setFormData(prevData => {
            // If the category is already selected, remove it, otherwise replace with new selection
            const isSelected = prevData.category.includes(categoryName);
            return {
                ...prevData,
                category: isSelected ? [] : [categoryName]
            };
        });

        // Clear category validation error when a category is selected
        if (validationErrors.category) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.category;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage({ text: "Please fix the errors in the form", type: "error" });
            return;
        }

        setLoading(true);
        setMessage({ text: "", type: "" });

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key !== 'category' && formData[key] !== null && formData[key] !== "") {
                formDataToSend.append(key, formData[key]);
            }
        });

        formData.category.forEach(cat => {
            formDataToSend.append('category', cat);
        });

        if (user?.organization_id) {
            formDataToSend.append("organization_id", user.organization_id);
        }

        try {
            const headers = {
                "Content-Type": "multipart/form-data",
            };

            if (user?.email) {
                headers["X-Org-Email"] = user.email;
            }

            const response = await axios.post("http://127.0.0.1:8000/events", formDataToSend, {
                headers: headers
            });

            setMessage({ text: response.data.message || "Event created successfully!", type: "success" });
            setPreviewImage(null);

            // Reset form
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
            let errorMessage = "An error occurred while submitting the form.";
            if (error.response) {
                if (error.response.data?.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data?.errors) {
                    // Handle backend validation errors
                    const backendErrors = {};
                    Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                        backendErrors[field] = messages.join(", ");
                    });
                    setValidationErrors(backendErrors);
                    errorMessage = "Please fix the validation errors";
                }
            } else if (error.request) {
                errorMessage = "No response from server. Please try again later.";
            }
            
            setMessage({ text: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseMessage = () => {
        setMessage({ text: "", type: "" });
    };

    useEffect(() => {
        if (!user) {
            setMessage({ text: "You must be logged in as an organization to create events", type: "error" });
        } else if (user.role !== "organization") {
            setMessage({ text: "Only organizations can create events", type: "error" });
        }
    }, [user]);

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-500 p-6">
            {/* Message Pop-up */}
            {message.text && (
                <div className={`fixed top-4 right-4 z-50 ${message.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"} border px-4 py-3 rounded-lg shadow-lg flex items-center justify-between max-w-md`}>
                    <div className="flex items-center">
                        {message.type === "error" ? (
                            <X className="w-5 h-5 mr-2" />
                        ) : (
                            <CheckCircle className="w-5 h-5 mr-2" />
                        )}
                        <span>{message.text}</span>
                    </div>
                    <button onClick={handleCloseMessage} className="ml-4">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${eventBg})` }}
            ></div>

            <div className="relative w-full md:w-[80%] lg:w-[70%] xl:w-[50%] mx-auto p-6 md:p-8 lg:p-10 bg-gray-50 shadow-lg rounded-lg mt-10">
                <h1 className="text-3xl font-bold text-orange-700">PledgeIt</h1>
                <h2 className="text-2xl font-bold text-gray-700 pb-5 mt-2">Create an Event</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Name *</label>
                        <input 
                            type="text" 
                            name="event_name" 
                            value={formData.event_name} 
                            placeholder="Event Name" 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.event_name ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.event_name && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.event_name}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <BadgeInfo size={18} opacity={0.6} />
                            <p className="text-sm block text-gray-500">Use specific, engaging, action-based titles to attract volunteers!</p>
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Upload Event Image *</label>
                        <input 
                            type="file" 
                            name="image_url" 
                            onChange={handleChange} 
                            className={`file-input w-full ${validationErrors.image_url ? "border-red-500" : ""}`} 
                            accept="image/*"
                        />
                        {validationErrors.image_url && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.image_url}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB. Accepted formats: JPEG, PNG</p>
                    </div>

                    {/* Image Preview */}
                    {previewImage && (
                        <div className="flex justify-center mt-4 mb-5">
                            <img src={previewImage} alt="Preview" className="w-80 h-45 object-cover rounded-lg shadow-md border" />
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Description *</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            placeholder="What should volunteers know about the event?"
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.description ? "border-red-500" : ""}`}
                            rows="5"
                        ></textarea>
                        {validationErrors.description && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">What will volunteers do? *</label>
                        <input 
                            type="text" 
                            name="skills_required" 
                            value={formData.skills_required} 
                            placeholder="e.g., Distribute food packages, Assist in event setup"
                            onChange={handleChange} 
                            className="w-full p-2 border rounded" 
                        />
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Category *</label>
                        <p className="text-gray-500 mb-1">only select one</p>
                        {validationErrors.category && (
                            <p className="text-red-500 text-sm mb-2">{validationErrors.category}</p>
                        )}
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
                        <input 
                            type="date" 
                            name="date" 
                            value={formData.date} 
                            onChange={handleChange} 
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full p-2 border rounded ${validationErrors.date ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.date && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Starting Time of the Event *</label>
                        <input 
                            type="time" 
                            name="time" 
                            value={formData.time} 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.time ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.time && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.time}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Venue for the Event *</label>
                        <input 
                            type="text" 
                            name="venue" 
                            value={formData.venue} 
                            placeholder="Place where the event will be held" 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.venue ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.venue && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.venue}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Location *</label>
                        <select
                            name="city"
                            onChange={handleChange}
                            className={`w-full p-2 border rounded ${validationErrors.city ? "border-red-500" : ""}`}
                            value={formData.city}
                        >
                            <option value="">Select a City</option>
                            {cityOptions.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        {validationErrors.city && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Full Address *</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            placeholder="e.g.,57, Ramakrishna Road, Colombo 06, Sri Lanka"
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.address ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.address && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Event Duration *</label>
                        <input 
                            type="text" 
                            name="duration" 
                            value={formData.duration} 
                            placeholder="e.g. 2 hours (Give in hours)" 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.duration ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.duration && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.duration}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Volunteer count *</label>
                        <input 
                            type="number" 
                            name="volunteer_requirements" 
                            value={formData.volunteer_requirements} 
                            placeholder="Number of volunteers required" 
                            onChange={handleChange} 
                            min="1"
                            className={`w-full p-2 border rounded ${validationErrors.volunteer_requirements ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.volunteer_requirements && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.volunteer_requirements}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Contact Email *</label>
                        <input 
                            type="email" 
                            name="contact_email" 
                            value={formData.contact_email} 
                            placeholder="Contact Person Email" 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.contact_email ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.contact_email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.contact_email}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Name of the Contact Person *</label>
                        <input 
                            type="text" 
                            name="contact_person_name" 
                            value={formData.contact_person_name} 
                            placeholder="Contact Person Name" 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.contact_person_name ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.contact_person_name && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.contact_person_name}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Contact number *</label>
                        <input 
                            type="tel" 
                            name="contact_person_number" 
                            value={formData.contact_person_number} 
                            placeholder="Contact Person Number" 
                            onChange={handleChange} 
                            className={`w-full p-2 border rounded ${validationErrors.contact_person_number ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.contact_person_number && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.contact_person_number}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Registration Deadline *</label>
                        <input 
                            type="date" 
                            name="registration_deadline" 
                            value={formData.registration_deadline} 
                            onChange={handleChange} 
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full p-2 border rounded ${validationErrors.registration_deadline ? "border-red-500" : ""}`} 
                        />
                        {validationErrors.registration_deadline && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.registration_deadline}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <BadgeInfo size={18} opacity={0.6} />
                            <p className="text-sm block text-gray-500">Note that you can't reopen submission after deadline is passed.</p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-gray-700 mb-1">Additional notes *</label>
                        <textarea 
                            name="additional_notes" 
                            value={formData.additional_notes} 
                            placeholder="Additional notes that might be worth mentioning" 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded"
                            rows="3"
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        className="px-10 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed" 
                        disabled={loading || !user || user.role !== "organization"}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventForm;