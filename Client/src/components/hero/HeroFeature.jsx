import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Award, MapPin } from "lucide-react";

const features = [
  {
    index: 1,
    icon: Heart,
    title: "Make an Impact",
    description:
      "Contribute to meaningful causes and create positive change in your community",
  },
  {
    index: 2,
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

function HeroFeature() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {features.map((feature, index) => (
        <div className="flex items-center gap-4 p-7 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 hover:orange ">
          <feature.icon className="w-8 h-8 text-orange-600 lg:w-12 h-12" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default HeroFeature;
