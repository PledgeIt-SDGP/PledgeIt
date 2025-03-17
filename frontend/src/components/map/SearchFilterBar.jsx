import React from "react";
import { Button, TextField, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

/**
 * Props:
 *  - searchTerm (string)
 *  - setSearchTerm (function)
 *  - sidebarOpen (bool)
 *  - setSidebarOpen (function)
 *  - onSearch (function) => callback to trigger the search logic
 */
const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  sidebarOpen,
  setSidebarOpen,
  onSearch,
}) => {
  const filterButtonVariant = sidebarOpen ? "contained" : "outlined";
  const filterButtonText = sidebarOpen ? "Hide Filters" : "Show Filters";

  return (
    <Box
      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-lg rounded-xl shadow p-5 w-full max-w-5xl mb-4"
      sx={{
        "& .MuiOutlinedInput-root, & .MuiButton-root": {
          height: 48,
        },
      }}
    >
      {/* Left text block */}
      <div className="flex flex-col flex-shrink-0 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-gray-600 mb-1">
          Find the Perfect Volunteer Event
        </h3>
        <p className="text-sm text-gray-500">
          Search by event name or city to get started.
        </p>
      </div>

      {/* Middle: Text field */}
      <div className="flex items-center gap-3 flex-1">
        <TextField
          placeholder="Event Name"
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              height: 48,
            },
          }}
        />

        {/* Search Button */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={onSearch}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              background: "linear-gradient(to right, #ef4444, #b91c1c)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(to right, #dc2626, #991b1b)",
              },
              minWidth: 120,
            }}
            startIcon={<Search strokeWidth={1.5} fill="none" />}
          >
            Search
          </Button>
        </motion.div>
      </div>

      {/* Right: Show/Hide Filters Button */}
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant={filterButtonVariant}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "8px",
            minWidth: 120,
            height: 48,
            ...(filterButtonVariant === "outlined" && {
              border: "2px solid #dc2626",
              color: "#dc2626",
            }),
            ...(filterButtonVariant === "contained" && {
              background: "linear-gradient(to right, #ef4444, #b91c1c)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(to right, #dc2626, #991b1b)",
              },
            }),
          }}
          startIcon={<Filter strokeWidth={1.5} fill="none" />}
        >
          {filterButtonText}
        </Button>
      </motion.div>
    </Box>
  );
};

export default SearchFilterBar;