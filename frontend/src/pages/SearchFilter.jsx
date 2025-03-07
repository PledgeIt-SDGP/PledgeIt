import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Typography } from "@mui/material";
import Category from "../components/search/Category";
import EventCards from "../components/search/EventCards";
import { Filter, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Footer1 from "../components/Footer1";
import VolunteerDashboard from "./VolunteerDashboard";

const SearchFilters = () => {
  const [filters, setFilters] = useState({
    event_type: "Any",
    city: "Any",
    event_name: "",
    addedMonth: "",
    date: "",
  });

  const [events, setEvents] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // State for toggling filter visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/events.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvents(data.events);
        setFilteredEvent(data.events);
      } catch (err) {
        setError(err);
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = events.filter((event) => {
      const matchesType =
        filters.event_type === "Any" ||
        event.category.toLowerCase() === filters.event_type.toLowerCase();

      const matchesName =
        filters.event_name === "" ||
        event.event_name
          .toLowerCase()
          .includes(filters.event_name.toLowerCase());

      const matchesCity =
        filters.city === "Any" ||
        event.city.toLowerCase() === filters.city.toLowerCase();

      const matchesYear =
        filters.date === "" ||
        new Date(event.date).getFullYear() === Number(filters.date);

      return matchesType && matchesName && matchesCity && matchesYear;
    });
    setFilteredEvent(filtered);
  };

  if (loading) {
    return (
      <Typography className="text-center text-xl">Loading events...</Typography>
    );
  }

  if (error) {
    return (
      <Typography className="text-center text-red-500 text-xl">
        Error: {error.message}
      </Typography>
    );
  }

  return (
   
    <VolunteerDashboard >
      <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
        <div className="max-w-7xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-6">
            Find Volunteer Opportunities
          </h1>
          <Category />

          {/* Filter Toggle Button */}
          <div className="flex justify-end mb-4">
            <button
              className="w-40 flex items-center justify-center gap-2 text-orange-500 border border-orange-500 bg-#fbf8f8f0 hover:bg-orange-500 hover:text-white font-medium rounded-2xl text-sm px-5 py-2.5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Search Section - Shown Only If showFilters is True */}
          {showFilters && (
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 lg:ml-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TextField
                  select
                  label="Category"
                  value={filters.event_type}
                  fullWidth
                  variant="outlined"
                  className="bg-gray-20 rounded-lg"
                  onChange={(e) =>
                    setFilters({ ...filters, event_type: e.target.value })
                  }
                >
                  <MenuItem value="Any">Any</MenuItem>
                  <MenuItem value="Environmental">Environment</MenuItem>
                  <MenuItem value="Healthcare">Health</MenuItem>
                  <MenuItem value="Community Service">Community</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Animal Welfare">Animal Welfare</MenuItem>
                  <MenuItem value="Human Rights">Human Rights</MenuItem>
                  <MenuItem value="Disaster Relief">Disaster Relief</MenuItem>
                  <MenuItem value="Life & Culture">Life & Culture</MenuItem>
                  <MenuItem value="Fundraising & Charity">
                    Fundraising & Charity
                  </MenuItem>
                </TextField>

                <TextField
                  select
                  label="Location"
                  value={filters.city}
                  fullWidth
                  variant="outlined"
                  className="bg-gray-20 rounded-lg"
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                >
                  <MenuItem value="Any">Any</MenuItem>
                  <MenuItem value="Colombo">Colombo</MenuItem>
                  <MenuItem value="Kandy">Kandy</MenuItem>
                  <MenuItem value="Galle">Galle</MenuItem>
                </TextField>
                <TextField
                  type="date"
                  name="date"
                  value={filters.date}
                  fullWidth
                  variant="outlined"
                  className="bg-gray-20 rounded-lg"
                  onChange={handleInputChange}
                />
                <TextField
                  label="Event Name"
                  name="event_name"
                  value={filters.event_name}
                  fullWidth
                  className="bg-gray-20 rounded-lg"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 transition-all font-medium rounded-xl text-md px-6 py-3 shadow-md hover:shadow-lg"
                  onClick={handleSearch}
                >
                  <Search size={18} /> Search Events
                </button>
              </div>
            </div>
          )}

          <EventCards filteredEvent={filteredEvent} />
        </div>
      </div>
      <Footer1 />

      </VolunteerDashboard >
    
  );
};

export default SearchFilters;
