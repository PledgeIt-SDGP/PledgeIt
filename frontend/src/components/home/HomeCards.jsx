import React from "react";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin } from "lucide-react";
import { animate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";

const Counter = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, target, { duration: 3 });
    return () => controls.stop();
  }, [target]);

  return <motion.span>{rounded}</motion.span>;
};

const HomeCards = () => {
  const [stats, setStats] = useState({
    activeVolunteers: 0,
    monthlyEvents: 0,
    citiesCovered: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/events.json"); // Fetch from the JSON file
        const jsonData = await response.json();

        if (!jsonData.events) return;

        // Calculate Active Volunteers
        const activeVolunteers = jsonData.events.reduce(
          (sum, events) => sum + (events.total_registered_volunteers || 0),
          0
        );

        // Calculate Monthly Events
        const currentMonth = new Date().getMonth() + 1;
        const monthlyEvents = jsonData.events.filter(
          (events) => new Date(events.date).getMonth() + 1 === currentMonth
        ).length;

        setStats({ activeVolunteers, monthlyEvents });
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };

    loadData();
  }, []);

  const cards = [
    {
      icon: Users,
      numbers: stats.activeVolunteers,
      title: "Active Volunteers",
      description: "and growing daily",
    },
    {
      icon: Calendar,
      numbers: stats.monthlyEvents,
      title: "Monthly Events",
      description: "across Sri lanka",
    },
    {
      icon: MapPin,
      numbers: "2",
      title: "Cities Covered",
      description: "nationwide impact",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {cards.map((feature, index) => (
        <motion.div
          key={index}
          className=" bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100 "
          whileHover={{ scale: 1.05 }}
        >
          <feature.icon className="w-8 h-10 text-orange-600" />
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              <Counter target={feature.numbers} /> +
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
export default HomeCards;
