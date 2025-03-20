import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, HelpCircle, Info, MapPin, Search, Settings } from "lucide-react";

// The Help Modal with enhanced UI and automatic close on backdrop click
const HelpModal = ({ onClose }) => {
    const iconHover = {
        scale: 1.1,
        transition: { duration: 0.2 },
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50"
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-lg md:max-w-xl border border-white/30"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                    <X className="w-6 h-6 filter drop-shadow-lg" strokeWidth={2} fill="none" />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">
                    How to Use This Map
                </h2>
                <div className="space-y-5">
                    <div className="flex gap-3 items-start">
                        <motion.div whileHover={iconHover}>
                            <Info className="w-6 h-6 text-red-500 filter drop-shadow-lg" strokeWidth={2} fill="none" />
                        </motion.div>
                        <p className="text-base text-white/90">
                            <strong>Browse Events:</strong> Click on any marker to view detailed event information including date, time, venue, and volunteer stats.
                        </p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <motion.div whileHover={iconHover}>
                            <MapPin className="w-6 h-6 text-red-500 filter drop-shadow-lg" strokeWidth={2} fill="none" />
                        </motion.div>
                        <p className="text-base text-white/90">
                            <strong>Filters:</strong> Open the filter panel to refine events by category, skills, status, date, organization, or venue.
                        </p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <motion.div whileHover={iconHover}>
                            <Search className="w-6 h-6 text-red-500 filter drop-shadow-lg" strokeWidth={2} fill="none" />
                        </motion.div>
                        <p className="text-base text-white/90">
                            <strong>Search:</strong> Use the search bar to quickly find events by name, city, or keyword.
                        </p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <motion.div whileHover={iconHover}>
                            <Settings className="w-6 h-6 text-red-500 filter drop-shadow-lg" strokeWidth={2} fill="none" />
                        </motion.div>
                        <p className="text-base text-white/90">
                            <strong>Map Controls:</strong> Use zoom and pan controls to navigate the map. Reset the view or use your current location to see nearby events.
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-right">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition shadow-md"
                    >
                        Got it!
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// The fixed Help Button that always appears at the bottom-left
const HelpButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 bg-white/80 backdrop-blur-md border border-red-500 text-red-600 px-5 py-3 rounded-full shadow-xl hover:bg-white transition"
        >
            <HelpCircle className="w-6 h-6 filter drop-shadow-lg" strokeWidth={2} fill="none" />
            <span className="font-semibold">Help</span>
        </button>
    );
};

// Container component that toggles the Help Modal
const HelpModalContainer = () => {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <>
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
            <HelpButton onClick={() => setShowHelp(true)} />
        </>
    );
};

export default HelpModalContainer;