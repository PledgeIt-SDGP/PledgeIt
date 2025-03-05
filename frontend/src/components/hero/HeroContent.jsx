import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

function heroContent() {
  return (
    <motion.div className="relative" initial="hidden" animate="visible">
      <div className="flex items-center mx-10 gap-2 mb-2 text-orange-600">
        <span className="text-lg font-medium">Welcome to PledgeIt</span>
      </div>

      <div className="text-6xl font-bold text-gray mx-10 gap-2">
        Empowering Change
        <span className="block mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 animate-gradient">
          Across Sri Lanka
        </span>
      </div>

      <div className="mx-10">
        <p className="text-lg text-gray-500 my-5">
          Join a vibrant community of change-makers transforming lives in
          Colombo, Galle, Kandy, and beyond. Your journey to making a difference
          starts here.
        </p>
        <button> 
          <Link
          to="/userpage"
          type="button"
          className="text-white font-medium rounded-full text-sm px-6 py-4 text-center mb-2 dark:bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 animate-gradient"
        >
          Start your journey
          </Link>
        </button>
        <button>
          <Link
            to="/about"
            className="px-8 py-4 rounded-full font-medium border-2 border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors block"
          >
            Learn More
          </Link>
        </button>
      </div>
    </motion.div>
  );
}

export default heroContent;
