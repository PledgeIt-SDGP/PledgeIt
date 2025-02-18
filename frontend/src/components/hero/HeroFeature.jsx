import "react";
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

export default function HeroFeature() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      animate="visible"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          <feature.icon className="w-10 h-10 text-orange-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
