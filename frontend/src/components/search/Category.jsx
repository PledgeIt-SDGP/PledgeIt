import React from "react";
import {
  Leaf,
  Heart,
  Users,
  PawPrint,
  Scale,
  CloudLightning,
  Gift,
  Landmark,
} from "lucide-react";

const categories = [
  {
    value: "Environment",
    label: "Environment",
    icon: <Leaf size={24} />,
  },
  {
    value: "Health",
    label: "Health",
    icon: <Heart size={24} />,
  },
  {
    value: "Community",
    label: "Community",
    icon: <Users size={24} />,
  },
  {
    value: "Animal Welfare",
    label: "Animal Welfare",
    icon: <PawPrint size={24} />,
  },
  {
    value: "Human Rights",
    label: "Human Rights",
    icon: <Scale size={24} />,
  },
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

function Category() {
  return (
    <div className="grid grid-cols-4  md:grid-cols-5 lg:grid-cols-9 gap-6 p-4 text-center lg:pl-20">
      {categories.map((item) => (
        <div
          key={item.value}
          className="flex flex-col items-center space-y-2l "
        >
          {/* Circular Icon Container */}
          <div
            className="w-14 h-14 flex items-center justify-center rounded-full 
            shadow-md bg-shadow shadow-red-500 text-orange-500"
          >
            {item.icon}
          </div>
          {/* Category Label */}
          <span className="font-medium text-sm text-gray-500 pt-4">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Category;
