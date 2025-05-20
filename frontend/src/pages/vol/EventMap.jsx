import React, { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import axios from "axios";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";

import { Icon } from "leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { CircularProgress } from "@mui/material";

import EventMarker from "../../components/map/EventMarker";
import MapControls from "../../components/map/MapControls";
import FilterSidebar from "../../components/map/FilterSidebar";
import SearchFilterBar from "../../components/map/SearchFilterBar";
import HelpModalContainer from "../../components/map/HelpModal";
import CountCards from "../../components/map/CountCards";
import VolunteerDashboard from "./VolunteerDashboard";

// Fix Leaflet icons
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// API + Default position
const API_URL = "https://pledgeit-backend-ihkh.onrender.com/events";
const CENTER_POSITION = [7.8731, 80.7718]; // Example: Sri Lanka

const EventMap = () => {
  // States for events, filters, UI, etc.
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // State and ref for full screen mode
  const mapWrapperRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Validation function for filters/search
  const validateFilters = () => {
    if (searchTerm.trim() !== "" && searchTerm.trim().length < 3) {
      setError("Search term must be at least 3 characters long.");
      return false;
    }
    if (selectedDate && !/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      setError("Please provide a valid date in the format YYYY-MM-DD.");
      return false;
    }
    setError("");
    return true;
  };

  // Fetch events and user location on mount
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setEvents(res.data);
        setFilteredEvents(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please check the backend.");
        setLoading(false);
      });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.error("Error fetching user location:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // Listen for full screen changes to update state if user exits via ESC
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Build query & filter events with proper parameters for organization and city.
  const applyFilters = useCallback(() => {
    try {
      if (!validateFilters()) {
        return;
      }
      setLoading(true);
      const params = {};
      if (selectedCategories.length > 0)
        params.category = selectedCategories.join(",");
      if (selectedOrganization) params.organization = selectedOrganization;
      if (selectedCity) params.city = selectedCity;
      if (selectedDate) params.date = selectedDate;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedSkills.length > 0)
        params.skills = selectedSkills.join(",");
      if (searchTerm.trim() !== "") params.search = searchTerm;

      axios
        .get(`${API_URL}/filter`, { params })
        .then((res) => {
          setFilteredEvents(res.data);
          setSidebarOpen(false);
        })
        .catch((err) => {
          console.error(
            "❌ Error fetching filtered events:",
            err.response?.data || err.message
          );
          setError(
            err.response?.data?.message ||
              "Error fetching filtered events. Please try again."
          );
          setFilteredEvents([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Exception in applyFilters:", error);
      setError("An unexpected error occurred while filtering events.");
      setLoading(false);
    }
  }, [
    selectedCategories,
    selectedOrganization,
    selectedCity,
    selectedDate,
    selectedStatus,
    selectedSkills,
    searchTerm,
  ]);

  // "Search" button handler
  const handleSearch = () => {
    applyFilters();
  };

  // Full screen toggle function using the Fullscreen API
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (mapWrapperRef.current.requestFullscreen) {
        mapWrapperRef.current.requestFullscreen();
      } else if (mapWrapperRef.current.mozRequestFullScreen) {
        mapWrapperRef.current.mozRequestFullScreen();
      } else if (mapWrapperRef.current.webkitRequestFullscreen) {
        mapWrapperRef.current.webkitRequestFullscreen();
      } else if (mapWrapperRef.current.msRequestFullscreen) {
        mapWrapperRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  // Stats calculations
  const totalEvents = filteredEvents.length;
  const totalVolunteers = filteredEvents.reduce(
    (acc, evt) => acc + (evt.total_registered_volunteers || 0),
    0
  );

  return (
    <VolunteerDashboard>
      <div className="min-h-screen w-full bg-[rgba(251,248,248,0.942)] flex flex-col items-center px-4 py-6">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-black mb-3 font-poppins text-center">
          Volunteer Events Map
        </h2>

        {error && (
          <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>
        )}

        {/* Search & Filter Bar */}
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onSearch={handleSearch}
        />

        {/* Filter Sidebar */}
        <FilterSidebar
          events={events}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          loading={loading}
          applyFilters={applyFilters}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedSkills={selectedSkills}
          setSelectedSkills={setSelectedSkills}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedOrganization={selectedOrganization}
          setSelectedOrganization={setSelectedOrganization}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />

        {/* MAP SECTION */}
        <div
          ref={mapWrapperRef}
          className={`relative ${isFullScreen ? "w-screen h-screen" : "w-full max-w-6xl"} ${
            sidebarOpen ? "z-0" : "z-10"
          }`}
        >
          <Suspense fallback={<CircularProgress color="secondary" />}>
            <MapContainer
              key={filteredEvents.length}
              center={CENTER_POSITION}
              zoom={8}
              className={`w-full ${
                isFullScreen ? "h-full" : "h-[600px] sm:h-[500px] md:h-[600px]"
              } shadow-lg rounded-2xl border border-gray-300`}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
                OpenStreetMap
              </a> contributors'
                maxZoom={18}
              />

              {/* Count Cards overlay on the map */}
              <CountCards
                totalEvents={totalEvents}
                totalVolunteers={totalVolunteers}
                loading={loading}
              />

              {/* User Location Marker */}
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
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((evt) => (
                    <EventMarker key={evt.event_id} event={evt} />
                  ))
                ) : (
                  !loading && (
                    <div className="text-center text-gray-500 mt-4">
                      <p>No matching events found. Try different filters.</p>
                    </div>
                  )
                )}
              </MarkerClusterGroup>

              <MapControls
                isFullScreen={isFullScreen}
                toggleFullScreen={toggleFullScreen}
              />
            </MapContainer>
          </Suspense>

          {/* The Help Modal Container handles its own fixed Help button (bottom left) */}
          <HelpModalContainer />
        </div>
      </div>
    </VolunteerDashboard>
  );
};

export default EventMap;
