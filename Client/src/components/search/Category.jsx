import React, { useState } from "react";
import {
  Leaf,
  Heart,
  Users,
  PawPrint,
  Scale,
  CloudLightning,
  Globe,
  Gift,
  Landmark,
} from "lucide-react";

const categories = [
  { value: "All", label: "All", icon: <Globe size={24} /> },
  { value: "Environment", label: "Environment", icon: <Leaf size={24} /> },
  { value: "Health", label: "Health", icon: <Heart size={24} /> },
  { value: "Community", label: "Community", icon: <Users size={24} /> },
  {
    value: "Animal Welfare",
    label: "Animal Welfare",
    icon: <PawPrint size={24} />,
  },
  { value: "Human Rights", label: "Human Rights", icon: <Scale size={24} /> },
  {
    value: "Disaster Relief",
    label: "Disaster Relief",
    icon: <CloudLightning size={24} />,
  },
  {
    value: "LifeCycle & Culture",
    label: "LifeCycle & Culture",
    icon: <Landmark size={24} />,
  },
  {
    value: "Fundraising & Charity",
    label: "Fundraising & Charity",
    icon: <Gift size={24} />,
  },
];

function Category({ onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState();

  const handleCategoryClick = (value) => {
    setSelectedCategory(value);
    onCategorySelect(value); // Pass selected category to parent component
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-6 p-4 text-center">
      {categories.map((item) => (
        <div
          key={item.value}
          onClick={() => handleCategoryClick(item.value)}
          className={`flex flex-col items-center space-y-2 cursor-pointer transition-all 
            ${
              selectedCategory === item.value
                ? "text-orange-600"
                : "text-gray-700"
            }`}
        >
          {/* Circular Icon Container */}
          <div
            className={`w-14 h-14 flex items-center justify-center rounded-full 
            shadow-md transition-all border-2 
            ${
              selectedCategory === item.value
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-gray-100 text-orange-600 border-gray-300"
            }`}
          >
            {item.icon}
          </div>
          {/* Category Label */}
          <span className="font-medium text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default Category;
