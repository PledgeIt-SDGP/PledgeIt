import React from "react";
import { useMap } from "react-leaflet";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Home, LocateFixed } from "lucide-react";

const MapControls = () => {
  const map = useMap();

  const controls = [
    {
      icon: ZoomIn,
      action: () => map.zoomIn(),
      label: "Zoom In",
    },
    {
      icon: ZoomOut,
      action: () => map.zoomOut(),
      label: "Zoom Out",
    },
    {
      icon: Home,
      action: () => map.setView([7.8731, 80.7718], 8),
      label: "Reset View",
    },
    {
      icon: LocateFixed,
      action: () => map.locate({ setView: true, maxZoom: 16 }),
      label: "My Location",
    },
  ];

  return (
    <div className="absolute right-4 top-4 z-[1000]">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-3 space-y-3 border border-gray-200">
        {controls.map((control) => (
          <motion.button
            key={control.label}
            onClick={control.action}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-600 shadow-md hover:bg-red-100 transition-all"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            title={control.label}
          >
            <control.icon className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MapControls;
