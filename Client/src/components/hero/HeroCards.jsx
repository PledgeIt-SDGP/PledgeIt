import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin } from "lucide-react";

const cards = [
  {
    icon: Users,
    numbers: "5,000+",
    title: "Active Volunteers",
    description: "and growing daily",
  },
  {
    icon: Calendar,
    numbers: "200+",
    title: "Monthly Events",
    description: "across Sri lanka",
  },
  {
    icon: MapPin,
    numbers: "20+",
    title: "Cities Covered",
    description: "nationwide impact",
  },
];

const HeroCards = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {cards.map((feature, index) => (
        <motion.div
          key={index}
          className=" bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100"
          whileHover={{ scale: 1.05 }}
        >
          <feature.icon className="w-8 h-10 text-orange-600" />
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {feature.numbers}
            </h3>
            <h3 className="text-lg font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
export default HeroCards;
