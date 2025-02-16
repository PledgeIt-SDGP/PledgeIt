import React, { useEffect, useState, Suspense } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import axios from "axios";
import Fuse from "fuse.js";
import MarkerClusterGroup from "react-leaflet-markercluster";
import EventMarker from "../components/map/EventMarker";
import MapControls from "../components/map/MapControls";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png"; 

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const CENTER_POSITION = [7.8731, 80.7718]; // Sri Lanka's center

const CATEGORIES = [
  { category_id: 1, category_name: "Environmental" },
  { category_id: 2, category_name: "Community Service" },
  { category_id: 3, category_name: "Education" },
  { category_id: 4, category_name: "Healthcare" },
  { category_id: 5, category_name: "Animal Welfare" },
  { category_id: 6, category_name: "Disaster Relief" },
  { category_id: 7, category_name: "Sports & Recreation" },
  { category_id: 8, category_name: "Arts & Culture" },
  { category_id: 9, category_name: "Technology & Innovation" },
  { category_id: 10, category_name: "Fundraising & Charity" },
  { category_id: 11, category_name: "Elderly Care" },
  { category_id: 12, category_name: "Women & Youth Empowerment" },
  { category_id: 13, category_name: "Rural Development" },
];

const LazyEventMap = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/events") 
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(response.data);
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  useEffect(() => {
    const fuse = new Fuse(events, {
      keys: ["event_name", "city"],
      threshold: 0.3,
    });

    const results = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : events;
    setFilteredEvents(results);
  }, [searchTerm, events]);

  useEffect(() => {
    let filtered = events;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) => selectedCategories.includes(event.category));
    }

    if (selectedStatus) {
      filtered = filtered.filter((event) => event.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter((event) => event.date === selectedDate);
    }

    setFilteredEvents(filtered);
  }, [selectedCategories, selectedStatus, selectedDate, events]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((c) => c !== category)
        : [...prevCategories, category]
    );
  };

  const handleCloseSidebar = (e) => {
    if (e.target.id === "sidebar-overlay") {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen p-6 bg-gray-50 text-black transition-all duration-300">
      <h2 className="text-center text-4xl font-extrabold mb-4 text-red-600">🌍 Volunteer Events Map</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search events..."
          className="border border-gray-300 p-3 rounded-md w-72 shadow-md focus:ring focus:ring-red-400 transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300"
        >
          {sidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {sidebarOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black opacity-40 z-[1000]"
          onClick={handleCloseSidebar}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 z-[1001] ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">🔍 Filters</h3>

          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-700">📌 Event Categories</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.category_id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-md ${
                    selectedCategories.includes(category.category_name)
                      ? "bg-red-600 text-white"
                      : "bg-cream-200 text-red-600 border border-red-600"
                  }`}
                  onClick={() => handleCategoryChange(category.category_name)}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-gray-700">📌 Event Status</h4>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="Open"
                  checked={selectedStatus === "Open"}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="accent-red-600"
                />
                <span>Open</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="Closed"
                  checked={selectedStatus === "Closed"}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="accent-red-600"
                />
                <span>Closed</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-lg z-0">
        <Suspense fallback={<div className="text-center p-5">Loading map...</div>}>
          <MapContainer center={CENTER_POSITION} zoom={8} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MarkerClusterGroup>
              {filteredEvents.map((event) => (
                <EventMarker key={event.id} event={event} />
              ))}
            </MarkerClusterGroup>

            <MapControls />
          </MapContainer>
        </Suspense>
      </div>
    </div>
  );
};

export default LazyEventMap;
