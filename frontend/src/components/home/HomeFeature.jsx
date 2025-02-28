import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Award, MapPin } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Make an Impact",
    description:
      "Contribute to meaningful causes and create positive change in your community",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with like-minded volunteers and grow together",
  },
  {
    icon: Award,
    title: "Earn Recognition",
    description:
      "Get rewarded for your contributions with badges and certificates",
  },
  {
    icon: MapPin,
    title: "Local Focus",
    description: "Find opportunities near you in major cities across Sri Lanka",
  },
];

function HomeFeature() {
  return (
    <>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6   transition-all duration-300 hover:shadow-md hover:scale-105"
          >
            <feature.icon className="w-8 h-8 text-orange-600 mb-3 lg:w-12 h-12 " />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 text-center lg:text-base">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default HomeFeature;
