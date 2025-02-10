import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "./HeroImage";
import HeroCards from "./HeroCards";
import HeroFeature from "./HeroFeature";
import { Heart } from "lucide-react";

const HeroContent = () => {
  return (
    <>
      <div className="relative min-h-[calc(100vh-64px)] flex flex-row items-center px-10 space-y-8 mt-25">
        {/* Left Content */}
        <div className="flex flex-col justify-center max-w-2xl space-y-6">
          <span className="flex flex-row gap-2 text-lg font-medium text-orange-600">
            <Heart className="w-6 h-6 text-orange-600" />
            Welcome to PledgeIt
          </span>

          <h1 className="text-6xl font-bold text-gray-900">
            Empowering Change
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
              Across Sri Lanka
            </span>
          </h1>

          <p className="text-lg text-gray-600">
            Join a vibrant community of change-makers transforming lives in
            Colombo, Galle, Kandy, and beyond. Your journey to making a
            difference starts here.
          </p>

          <div className="flex space-x-4">
            <Link
              to="/event"
              className="px-6 py-3 text-sm font-medium text-white rounded-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:opacity-80"
            >
              Start your journey
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 text-sm font-medium border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-50 transition-colors"
            >
              Learn More
            </Link>
          </div>

          <HeroCards />
        </div>

        <div className="hidden lg:block mx-10">
          {/* Right Image */}
          <HeroImage />
        </div>
      </div>

      <div className="flex flex-row gap-7 mx-10">
        <HeroFeature />
      </div>
    </>
  );
};

export default HeroContent;
