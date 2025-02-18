import { BadgeInfo, ImagePlus } from "lucide-react";
import CauseType from "../orgRegistration/CauseType";
import { useState } from 'react';

const EventDetail = ({ eventData }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create a URL for the selected file
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setEventData((prevData) => ({ ...prevData, image: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //back end intergration code
    }

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 pb-10">
            <form
                className="space-y-4 w-220 bg-gray-50 rounded-lg px-20 py-20 border border-gray-300 border-opacity-50"
                encType="multipart/form-data"> {/*Required for sending files (e.g., images) with the form*/}

                <div className="mb-5">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

                    <label className="block text-gray-700 mb-1">Event Name *</label>
                    <input
                        type="text"
                        placeholder="Event Name"
                        name="event_name"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 ">Use specific, engaging, action-based titles to attract volunteers!</p>
                    </div>
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Event Description *</label>
                    <textarea
                        name="description"
                        placeholder="What should volunteers know about the event?"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
                        rows="3"
                        required
                    ></textarea>
                </div>

                {/* skills_required */}
                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">What will volunteers do? *</label>
                    <textarea
                        name="skills_required"
                        placeholder="e.g., Distribute food packages, assist in event setup"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
                        rows="3"
                        required
                    ></textarea>
                </div>

                {/* volunteer-requirements */}
                <div className="mb-10">
                    <label className="block text-gray-700 mb-1">What will volunteers bring or wear? *</label>
                    <input
                        type="text"
                        name="volunteer_requirements"
                        placeholder="e.g., Must bring gloves, wear comfortable clothes"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="mb-10">
                    <label className="text-lg font-semibold">Photo</label>
                    <p className="block text-gray-700 mb-2"> Choose a quality photo. Avoid photos with logos and white backgrounds </p>
                    <div className="relative w-80 h-40 rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-200 overflow-hidden cursor-pointer">
                        {image ? (
                            <img src={image} alt="Event" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl text-gray-600"><ImagePlus /></span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute opacity-0 w-full h-full cursor-pointer"
                            name="image_url"
                            required
                        />
                    </div>
                </div>

                <div className="mb-10">
                    <label className="text-lg font-semibold mb-4">Causes</label>
                    <div className="flex items-center gap-2 mt-2">
                        <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 ">Help volunteers discover your event by selecting the causes that event activities support</p>
                    </div>
                    <div className="mr-20">
                        <CauseType />
                    </div>
                </div>

                <h2 className="text-lg font-semibold mb-4">Host</h2>
                <div className="flex items-center gap-2 mt-2">
                    <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 ">Include the following to ensure clear communication, coordination, and accountability for the event.</p>
                </div>
                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Contact person for the event *</label>
                    <input
                        type="text"
                        name="contact_person"
                        placeholder="Contact Person's Name"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Contact Email*</label>
                    <input
                        type="email"
                        name="contact_email"
                        placeholder="example@example.com"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Contact Number *</label>
                    <input
                        type="tel"
                        name="contact_number"
                        placeholder="e.g., 0711234567"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>
            </form>
        </div>
    );
}

export default EventDetail;
