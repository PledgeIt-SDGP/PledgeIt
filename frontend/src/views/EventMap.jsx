import React, { useEffect, useState, Suspense, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
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

// Fix for default marker icons in react-leaflet
import { Icon } from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = events;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((event) =>
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event) =>
        selectedCategories.includes(event.category)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter((event) => event.status === selectedStatus);
    }

    if (selectedDate) {
      filtered = filtered.filter((event) => event.date === selectedDate);
    }

    if (selectedOrganization) {
      filtered = filtered.filter(
        (event) => event.organization === selectedOrganization
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((event) =>
        selectedSkills.some((skill) => event.skills_required.includes(skill))
      );
    }

    if (selectedVenue) {
      filtered = filtered.filter((event) => event.venue === selectedVenue);
    }

    setFilteredEvents(filtered);
  }, [
    events,
    searchTerm,
    selectedCategories,
    selectedStatus,
    selectedDate,
    selectedOrganization,
    selectedSkills,
    selectedVenue,
  ]);

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen p-6 bg-gray-50 text-black transition-all duration-300">
      <h2 className="text-center text-4xl font-extrabold mb-4 text-red-600">
        🌍 Volunteer Events Map
      </h2>
      {error && <p className="text-red-600 font-semibold">{error}</p>}{" "}
      {/* Show error message */}
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
          className="fixed inset-0 bg-black opacity-40 z-[1000]"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transition-transform duration-300 z-[1001] overflow-y-auto p-6 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <h3 className="text-lg font-semibold mb-4 text-red-600">🔍 Filters</h3>

        {/* Event Categories */}
        <h4 className="font-semibold mb-2 text-gray-700">
          📌 Event Categories
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {[...new Set(events.map((event) => event.category))].map(
            (category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full border-2 ${
                  selectedCategories.includes(category)
                    ? "bg-red-600 text-white"
                    : "border-red-600 text-red-600"
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
          ].map((skill) => ({ value: skill, label: skill }))} // Convert skills into dropdown options
          value={selectedSkills.map((skill) => ({
            value: skill,
            label: skill,
          }))} // Convert selected values for dropdown
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
          onClick={applyFilters}
          className="bg-red-600 hover:bg-red-700 text-white mt-4"
        >
          Apply Filters
        </Button>
      </div>
      <Suspense fallback={<CircularProgress color="secondary" />}>
        <MapContainer
          center={CENTER_POSITION}
          zoom={8}
          className="w-full h-[600px]"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={18}
          />
          <MarkerClusterGroup>
            {filteredEvents.map((event) => (
              <EventMarker key={event.event_id} event={event} />
            ))}
          </MarkerClusterGroup>
          <MapControls />
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default LazyEventMap;
