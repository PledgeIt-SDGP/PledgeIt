import { useState, useEffect } from "react";
import axios from "axios";
import { BadgeInfo } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    description: "",
    skills_required: "",
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
    additional_notes: ""
  });

  const cityOptions = ["Colombo", "Galle", "Kandy"];

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/events/${eventId}`);
        const eventData = response.data;
        setOriginalData(eventData);

        // Format date for input fields if needed
        const formattedDate = eventData.date
          ? new Date(eventData.date).toISOString().split("T")[0]
          : "";
        const formattedDeadline = eventData.registration_deadline
          ? new Date(eventData.registration_deadline).toISOString().split("T")[0]
          : "";

        setFormData({
          description: eventData.description || "",
          skills_required: Array.isArray(eventData.skills_required)
            ? eventData.skills_required.join(", ")
            : eventData.skills_required || "",
          date: formattedDate,
          time: eventData.time || "",
          venue: eventData.venue || "",
          city: eventData.city || "",
          address: eventData.address || "",
          duration: eventData.duration || "",
          volunteer_requirements: eventData.volunteer_requirements || "",
          contact_email: eventData.contact_email || "",
          contact_person_name: eventData.contact_person?.name || "",
          contact_person_number: eventData.contact_person?.contact_number || "",
          registration_deadline: formattedDeadline,
          additional_notes: eventData.additional_notes || ""
        });
        setLoading(false);
      } catch (error) {
        setMessage(
          "Error loading event details: " +
            (error.response?.data?.detail || "An error occurred. Try again later...")
        );
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Merge originalData with updated formData and update contact_person accordingly.
    const updatedPayload = {
      ...originalData,
      ...formData,
      // If skills_required was originally an array, convert the comma-separated string back into an array.
      skills_required: formData.skills_required.split(",").map((skill) => skill.trim()),
      contact_person: {
        name: formData.contact_person_name,
        contact_number: formData.contact_person_number
      }
    };

    try {
      // Use PUT instead of PATCH since the backend update endpoint is defined as PUT.
      const response = await axios.put(`http://127.0.0.1:8000/events/${eventId}`, updatedPayload, {
        headers: {
          // Add any required headers here (e.g., authentication)
        }
      });
      setMessage(response.data.message || "Event updated successfully");
      setTimeout(() => {
        navigate("/orgevents"); // Redirect back to events list
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.detail || "An error occurred while updating the event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-500 p-6">
      <div className="absolute inset-0 bg-[url('eventbackground.jpg')] bg-cover bg-center opacity-20"></div>

      <div className="relative w-full md:w-[80%] lg:w-[70%] xl:w-[50%] mx-auto p-6 md:p-8 lg:p-10 bg-gray-50 shadow-lg rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-orange-700">PledgeIt</h1>
        <h2 className="text-2xl font-bold text-gray-700 pb-5 mt-2">Edit Event</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        <p className="text-red-600 font-semibold text-md mb-4">
          Only edit the details you want to change.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Event Description</label>
            <textarea
              name="description"
              value={formData.description}
              placeholder="What should volunteers know about the event?"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">What will volunteers do?</label>
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
            <label className="block text-gray-700 mb-1">Date of the Event</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Starting Time of the Event</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Venue for the Event</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              placeholder="Place where the event will be held"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Event Location</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
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
            <label className="block text-gray-700 mb-1">Full Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="e.g., 57, Ramakrishna Road, Colombo 06, Sri Lanka"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Event Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              placeholder="e.g. 2 hours (Give in hours)"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Volunteer count</label>
            <input
              type="text"
              name="volunteer_requirements"
              value={formData.volunteer_requirements}
              placeholder="Number of volunteers required"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              placeholder="Contact Person Email"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Name of the Contact Person</label>
            <input
              type="text"
              name="contact_person_name"
              value={formData.contact_person_name}
              placeholder="Contact Person Name"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Contact number</label>
            <input
              type="text"
              name="contact_person_number"
              value={formData.contact_person_number}
              placeholder="Contact Person Number"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Registration Deadline</label>
            <input
              type="date"
              name="registration_deadline"
              value={formData.registration_deadline}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center gap-2 mt-2">
              <BadgeInfo size={18} opacity={0.6} />
              <p className="text-sm block text-gray-500">
                Note that you can't reopen submission after deadline is passed.
              </p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 mb-1">Additional notes</label>
            <textarea
              name="additional_notes"
              value={formData.additional_notes}
              placeholder="Additional notes that might be worth mentioning"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-10 py-2 bg-red-600 text-white text-center rounded-lg hover:bg-red-700"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Event"}
            </button>
            <button
              type="button"
              className="px-10 py-2 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700"
              onClick={() => navigate("/orgevents")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEvent;
