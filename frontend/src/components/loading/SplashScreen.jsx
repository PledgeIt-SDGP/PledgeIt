import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        navigate("/home");
      }, 800);
    }, 3200);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white text-center"
        >
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative flex flex-col items-center space-y-8"
          >
            {/* "PledgeIt" Title + "Make a Difference..." (Fade in smoothly together) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h1
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight"
                style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.2" }}
              >
                PledgeIt
              </h1>
              <p
                className="text-xl font-semibold text-gray-900 mt-2"
                style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.3" }}
              >
                Make a difference, one pledge at a time
              </p>
            </motion.div>

            {/* Heart Icon with Soft, Rhythmic Beat & Glow */}
            <motion.div
              className="relative flex items-center justify-center mt-4"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <motion.div
                className="w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-red-400 overflow-hidden"
                animate={{
                  boxShadow: [
                    "0px 0px 15px rgba(255, 77, 77, 0.4)",
                    "0px 0px 35px rgba(255, 153, 102, 0.6)",
                    "0px 0px 15px rgba(255, 77, 77, 0.4)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                >
                  <Heart className="w-16 h-16 text-red-600" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
