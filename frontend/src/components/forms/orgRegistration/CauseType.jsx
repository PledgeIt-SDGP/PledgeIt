
import React, { useState } from "react";
import { Brush, CloudRainWind, HeartPulse, PawPrint, Ribbon, School, SproutIcon, Users } from 'lucide-react';

const categoriesData = [

    { id: 1, name: "Environmental", icon: <SproutIcon />, selected: false },
    { id: 2, name: "Community Service", icon: <Users />, selected: false },
    { id: 3, name: "Education", icon: <School />, selected: false },
    { id: 4, name: "Healthcare", icon: <HeartPulse />, selected: false },
    { id: 5, name: "Animal Welfare", icon: <PawPrint />, selected: false },
    { id: 6, name: "Disaster Relief", icon: <CloudRainWind />, selected: false },
    { id: 7, name: "Lifestyle & Culture", icon: <Brush />, selected: false },
    { id: 8, name: "Fundraising & Charity", icon: <Ribbon />, selected: false }
]


const CauseType = () => {

    const [categories, setCategories] = useState(
        categoriesData.map((category) => ({
            ...category,
            selected: false,  // Initially, no category is selected
        }))
    );

    const handleCategoryClick = (id) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === id ? { ...category, selected: !category.selected } : category
            )
        );
    };


    return (
        <div className="grid grid-cols-4 gap-2 mt-6">
            {categories.map((category) => (
                <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex flex-col items-center justify-center w-38 h-35 border rounded-xl shadow-md cursor-pointer 
                        ${category.selected ? "border-orange-400" : "border-red-600/90"} 
                        ${category.selected ? "bg-red-100" : "bg-white"} transition`}
                >
                    <div className="opacity-75 bg-gray-100 p-2 rounded-full ">{category.icon}</div>
                    <p className="mt-2 text-xs text-center font-medium text-gray-700">{category.name}</p>

                </div>

            ))}

        </div>
    );

}
export default CauseType;