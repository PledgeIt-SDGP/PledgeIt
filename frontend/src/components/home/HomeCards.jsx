import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin } from "lucide-react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import useUsers from "../../hooks/useUsers";
import useEvents from "../../hooks/useEvents";

const Counter = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (typeof target === 'number' && !isNaN(target)) {
      const controls = animate(count, target, { duration: 3 });
      return () => controls.stop();
    }
  }, [target]);

  return <motion.span>{rounded}</motion.span>;
};

const HomeCards = () => {
  const { totalUsers, loading: usersLoading, error: usersError } = useUsers();
  const { totalEvents, loading: eventsLoading, error: eventsError } = useEvents();

  if (usersLoading || eventsLoading) {
    return <div>Loading...</div>;
  }

  if (usersError || eventsError) {
    return (
      <div className="text-red-500 text-center">
        Error fetching data: {usersError?.message || eventsError?.message}
      </div>
    );
  }

  const cards = [
    {
      icon: Users,
      numbers: totalUsers,
      title: "Active Users",
      description: "and growing daily",
    },
    {
      icon: Calendar,
      numbers: totalEvents,
      title: "Total Events",
      description: "across Sri Lanka",
    },
    {
      icon: MapPin,
      numbers: 3, // Static value for cities covered
      title: "Cities Covered",
      description: "nationwide impact",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {cards.map((feature, index) => (
        <motion.div
          key={index}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer border border-gray-100"
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