import React from "react";
import Select from "react-select";
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import {
  X,
  Tag,
  List,
  AlertTriangle,
  Building,
  MapPin,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const FilterSidebar = ({
  events,
  sidebarOpen,
  setSidebarOpen,
  loading,
  applyFilters,
  selectedCategories,
  setSelectedCategories,
  selectedSkills,
  setSelectedSkills,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  selectedOrganization,
  setSelectedOrganization,
  // Removed venue props and added city filter props:
  selectedCity,
  setSelectedCity,
}) => {
  // Clear all filters function
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSkills([]);
    setSelectedStatus("");
    setSelectedDate("");
    setSelectedOrganization("");
    setSelectedCity("");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-80 sm:w-96
          bg-white/90 backdrop-blur-lg
          shadow-lg border border-gray-200
          transition-transform duration-300 z-[1100]
          overflow-y-auto p-6
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Heading & Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-red-700">Filters</h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={2} fill="none" />
          </button>
        </div>

        {/* Event Categories */}
        <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
          <Tag className="w-5 h-5 text-red-600" strokeWidth={2} fill="none" />
          Event Categories
        </h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {[...new Set(events.map((event) => event.category))].map(
            (category) => (
              <button
                key={category}
                className={`
                px-4 py-2 rounded-full border-2 transition-all duration-300
                ${
                  selectedCategories.includes(category)
                    ? "bg-amber-100 border-amber-400 text-black shadow-md"
                    : "border-red-500 text-black hover:bg-red-100"
                }
              `}
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

        {/* Skills */}
        <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
          <List className="w-5 h-5 text-red-600" strokeWidth={2} fill="none" />
          Skills Required
        </h4>
        <Select
          isMulti
          options={
            [...new Set(events.flatMap((evt) => evt.skills_required || []))].map(
              (skill) => ({ value: skill, label: skill })
            )
          }
          value={selectedSkills.map((skill) => ({ value: skill, label: skill }))}
          onChange={(selectedOptions) =>
            setSelectedSkills(selectedOptions.map((option) => option.value))
          }
          className="mb-6"
          styles={{
            control: (base) => ({
              ...base,
              fontSize: "0.875rem",
              color: "black",
            }),
            option: (base) => ({
              ...base,
              color: "black",
            }),
          }}
        />

        {/* Event Status */}
        <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={2} fill="none" />
          Event Status
        </h4>
        <RadioGroup
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="mb-6"
        >
          <FormControlLabel
            value="Open"
            control={<Radio color="error" />}
            label="Open"
            style={{ color: "black" }}
          />
          <FormControlLabel
            value="Closed"
            control={<Radio color="error" />}
            label="Closed"
            style={{ color: "black" }}
          />
        </RadioGroup>

        {/* Event Date */}
        <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-red-600" strokeWidth={2} fill="none" />
          Event Date
        </h4>
        <TextField
          type="date"
          variant="outlined"
          fullWidth
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mb-6"
          size="small"
          InputProps={{
            style: { color: "black", fontSize: "0.875rem" },
          }}
        />

        {/* Organization */}
        <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
          <Building className="w-5 h-5 text-red-600" strokeWidth={2} fill="none" />
          Organization
        </h4>
        <Select
          options={
            [...new Set(
              events.map((event) => ({
                value: event.organization,
                label: event.organization,
              }))
            )]
          }
          value={
            selectedOrganization
              ? { value: selectedOrganization, label: selectedOrganization }
              : null
          }
          onChange={(selected) => setSelectedOrganization(selected.value)}
          className="mb-6"
          styles={{
            control: (base) => ({
              ...base,
              fontSize: "0.875rem",
              color: "black",
            }),
            option: (base) => ({
              ...base,
              color: "black",
            }),
          }}
        />

        {/* City */}
        <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" strokeWidth={2} fill="none" />
          City
        </h4>
        <Select
          options={
            [...new Set(
              events.map((event) => ({
                value: event.city,
                label: event.city,
              }))
            )]
          }
          value={selectedCity ? { value: selectedCity, label: selectedCity } : null}
          onChange={(selected) => setSelectedCity(selected.value)}
          className="mb-6"
          styles={{
            control: (base) => ({
              ...base,
              fontSize: "0.875rem",
              color: "black",
            }),
            option: (base) => ({
              ...base,
              color: "black",
            }),
          }}
        />

        {/* Clear & Apply Filters */}
        <div className="flex gap-4 mt-8">
          {/* Clear Filters */}
          <div className="flex-1">
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
              className="!bg-white !text-red-500 !border !border-red-500 hover:!bg-red-50"
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Apply Filters */}
          <div className="flex-1">
            <Button
              variant="contained"
              fullWidth
              onClick={applyFilters}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-lg py-2 shadow-lg"
              disabled={loading}
              color="error"
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Applying..." : "Apply Filters"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
