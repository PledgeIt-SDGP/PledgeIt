import { BadgeInfo } from "lucide-react";

const EventDetail2 = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 pb-10">
            <form
                className="space-y-4 w-250 bg-gray-50 rounded-lg px-20 py-20 border border-gray-300 border-opacity-50"
            >

                <div className="mb-5">
                    <h2 className="text-lg font-semibold mb-4">When</h2>

                    <label className="block text-gray-700 mb-1">Event Location *</label>
                    <input
                        type="date"
                        name="date"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Event Time *</label>
                    <input
                        type="time"
                        name="time"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />

                    <label className="block text-gray-700 mb-1">Event Duration *</label>
                    <input
                        type="number"
                        name="duration"
                        placeholder="e.g., 2 hours, 4 hours"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        min={0}
                        required
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 "> Enter the estimated time for the event to be held</p>
                    </div>
                </div>

                <div className="mb-5">
                    <h2 className="text-lg font-semibold mb-4">Where</h2>

                    <label className="block text-gray-700 mb-1">Event Location *</label>
                    <input
                        type="text"
                        name="venue"
                        placeholder="Venue Name"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Full Address *</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="e.g.,57, Ramakrishna Road, Colombo 06, Sri Lanka"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <h2 className="text-lg font-semibold mb-4">Other important details</h2>

                    <label className="block text-gray-700 mb-1">Registration deadline *</label>
                    <input
                        type="time"
                        name="deadline"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Additional notes *</label>
                    <input
                        type="text"
                        name="additionalNotes"
                        placeholder="Any addtional information that the volunteer might need"
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-gray-700 mb-1">Volunteer count *</label>
                    <input
                        type="number"
                        name="additionalNotes"
                        min={0}
                        className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        required
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <BadgeInfo size={18} opacity={0.6} /><p className="text-sm block text-gray-500 "> Enter the expected number of volunteers needed for the event</p>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default EventDetail2;
