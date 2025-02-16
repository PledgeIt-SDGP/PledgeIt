import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Search = () => {
  const [filters, setFilters] = useState({
    event_type: "Any",
    city: "Any",
    event_name: "",
    addedMonth: "",
    date: "",
  });

  const [events, setEvent] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/events.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEvent(data.events);
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
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Find Volunteer Opportunities
      </h1>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 ">
          <TextField
            select
            label="Event Type"
            value={filters.event_type}
            fullWidth
            onChange={(e) =>
              setFilters({ ...filters, event_type: e.target.value })
            }
          >
            <MenuItem value="Any">Any</MenuItem>
            <MenuItem value="Environmental">Environmental</MenuItem>
            <MenuItem value="Healthcare">Healthcare</MenuItem>
            <MenuItem value="Community Service">Community Service</MenuItem>
            <MenuItem value="Education">Education</MenuItem>
            <MenuItem value="Animal Welfare">Animal Welfare</MenuItem>
            <MenuItem value="Disaster Relief">Disaster Relief</MenuItem>
            <MenuItem value="Lifestyle & Culture">Lifestyle & Culture</MenuItem>
            <MenuItem value="Fundraising & Charity">
              Fundraising & Charity
            </MenuItem>
          </TextField>
          <TextField
            type="date"
            name="date"
            value={filters.date}
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            label="Event Name"
            name="event_name"
            value={filters.event_name}
            fullWidth
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            type="button"
            className="w-90 mt-3 text-white bg-gradient-to-r from-orange-400 via-red-500 to-red-600 hover:bg-gradient-to-br font-medium rounded-2xl text-sm px-5 py-2.5 text-center mb-2"
            onClick={handleSearch}
          >
            Search Events
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-6">
        {filteredEvent.map((event) => (
          <div
            key={event.id}
            className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden flex flex-col w-72 h-110 mx-auto"
          >
            <img
              src={event.image_url}
              alt={event.event_name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 flex flex-col space-y-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {event.event_name}
              </h2>
              <p className="bg-orange-100 text-orange-500 font-medium px-2 py-1 rounded-xl inline-block w-fit">
                {event.category}
              </p>
              <p className="text-gray-600 text-sm">{event.city}</p>
              <p className="text-gray-600 text-sm">{event.date}</p>
              <p className="text-gray-500 text-sm">{event.description}</p>
              <div className="text-md font-semibold text-orange-600">
                <Link to={`/event_details`} className="view-more-link">
                  View More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
