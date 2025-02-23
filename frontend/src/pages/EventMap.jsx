import React, { useEffect, useState, Suspense, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import axios from "axios";
import MarkerClusterGroup from "react-leaflet-markercluster";
import EventMarker from "../components/map/EventMarker";
import MapControls from "../components/map/MapControls";
import "leaflet/dist/leaflet.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Select from "react-select";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Icon } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// API Base URL
const API_URL = "http://127.0.0.1:8000/events";

// Default map position (Sri Lanka)
const CENTER_POSITION = [7.8731, 80.7718];

const LazyEventMap = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track API errors

  // (Optional) User location marker
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}`)
      .then((response) => {
        setEvents(response.data);
        setFilteredEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please check the backend.");
        setLoading(false);
      });

    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error("Error fetching user location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  const applyFilters = useCallback(() => {
    setLoading(true);
    // Build query parameters dynamically (Only include selected filters)
    const params = {};
    if (selectedCategories.length > 0)
      params.category = selectedCategories.join(",");
    if (selectedOrganization) params.city = selectedOrganization;
    if (selectedDate) params.date = selectedDate;
    if (selectedStatus) params.status = selectedStatus;
    if (selectedSkills.length > 0) params.skills = selectedSkills.join(",");
    if (selectedVenue) params.venue = selectedVenue;
    if (searchTerm.trim() !== "") params.search = searchTerm;

    console.log("🔍 Applying filters:", params); // Debugging log

    axios
      .get(`${API_URL}/filter`, { params })
      .then((response) => {
        setFilteredEvents(response.data);
        setSidebarOpen(false);
      })
      .catch((error) => {
        console.error(
          "❌ Error fetching filtered events:",
          error.response?.data || error.message
        );
        setFilteredEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    selectedCategories,
    selectedOrganization,
    selectedDate,
    selectedStatus,
    selectedSkills,
    selectedVenue,
    searchTerm,
  ]);

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen p-6 bg-gray-50 text-black transition-all duration-300">
      <h2 className="text-center text-4xl font-extrabold mb-4 text-red-600">
        🌍 Volunteer Events Map
      </h2>
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {/* Search & Filter Bar Container with Glassmorphism */}
      <div className="flex flex-wrap justify-center gap-4 mb-4 bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200">
        <input
          type="text"
          placeholder="🔍 Search events..."
          className="border border-gray-300 p-3 rounded-lg w-72 shadow-sm focus:ring focus:ring-red-400 transition-all duration-200 bg-gray-100 text-black placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg shadow-md hover:opacity-90 transition-all flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <Filter className="w-5 h-5" />
          {sidebarOpen ? "Hide Filters" : "Show Filters"}
        </motion.button>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Sidebar with Glassmorphism & Enhanced Borders */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/90 backdrop-blur-lg shadow-lg border border-gray-200 transition-transform duration-300 z-[1001] overflow-y-auto p-6 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold mb-4 text-red-700 flex items-center">
            <Filter className="mr-2" />
            Filters
          </h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Event Categories */}
        <h4 className="font-semibold mb-2 text-gray-700">
          📌 Event Categories
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {[...new Set(events.map((event) => event.category))].map(
            (category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 
                  ${
                    selectedCategories.includes(category)
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md"
                      : "border-red-500 text-red-600 hover:bg-red-100"
                  }`}
                onClick={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(category)
                      ? prev.filter((c) => c !== category)
                      : [...prev, category]
                  )
                }
              >
                {category}
              </button>
            )
          )}
        </div>
        {/* Skills Required Dropdown */}
        <h4 className="font-semibold mb-2 text-gray-700">🛠 Required Skills</h4>
        <Select
          isMulti
          options={[
            ...new Set(events.flatMap((event) => event.skills_required || [])),
          ].map((skill) => ({ value: skill, label: skill }))}
          value={selectedSkills.map((skill) => ({
            value: skill,
            label: skill,
          }))}
          onChange={(selectedOptions) =>
            setSelectedSkills(selectedOptions.map((option) => option.value))
          }
          className="mb-4"
        />
        {/* Status */}
        <h4 className="font-semibold mb-2 text-gray-700">📌 Event Status</h4>
        <RadioGroup
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="mb-4"
        >
          <FormControlLabel
            value="Open"
            control={<Radio color="secondary" />}
            label="Open"
          />
          <FormControlLabel
            value="Closed"
            control={<Radio color="secondary" />}
            label="Closed"
          />
        </RadioGroup>
        {/* Date Selection */}
        <h4 className="font-semibold mb-2 text-gray-700">📅 Event Date</h4>
        <TextField
          type="date"
          variant="outlined"
          fullWidth
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-4"
        />
        {/* Organization */}
        <h4 className="font-semibold mb-2 text-gray-700">🏢 Organization</h4>
        <Select
          options={[
            ...new Set(
              events.map((event) => ({
                value: event.organization,
                label: event.organization,
              }))
            ),
          ]}
          onChange={(selected) => setSelectedOrganization(selected.value)}
          className="mb-4"
        />
        {/* Venue */}
        <h4 className="font-semibold mb-2 text-gray-700">📍 Venue</h4>
        <Select
          options={[
            ...new Set(
              events.map((event) => ({
                value: event.venue,
                label: event.venue,
              }))
            ),
          ]}
          onChange={(selected) => setSelectedVenue(selected.value)}
          className="mb-4"
        />
        <Button
          variant="contained"
          fullWidth
          onClick={() => {
            applyFilters();
            setSidebarOpen(false);
          }}
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-lg py-3 mt-4 shadow-lg"
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Filters"}
        </Button>
      </div>
      <Suspense fallback={<CircularProgress color="secondary" />}>
        <MapContainer
          key={filteredEvents.length}
          center={CENTER_POSITION}
          zoom={8}
          className="w-full h-[600px] shadow-lg rounded-2xl border border-gray-300"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />
          {/* User's current location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.icon({
                iconUrl:
                  "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
          )}
          <MarkerClusterGroup
            iconCreateFunction={(cluster) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div class="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full border-2 border-white shadow-lg font-bold">${count}</div>`,
                className: "marker-cluster",
                iconSize: L.point(40, 40),
              });
            }}
          >
            {filteredEvents.length > 0
              ? filteredEvents.map((event) => (
                  <EventMarker key={event.event_id} event={event} />
                ))
              : !loading && (
                  <div className="text-center text-gray-500 mt-4">
                    <p>No matching events found. Try different filters.</p>
                  </div>
                )}
          </MarkerClusterGroup>
          <MapControls />
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default LazyEventMap;
