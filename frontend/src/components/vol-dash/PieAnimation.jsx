import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieAnimation({ categories }) {
  const [radius] = React.useState(100);

  // Custom color palette
  const pieColors = [
    "#ff6600", "#ffdca5", "#ffc26d", "#ff9d32", 
    "#ff7f0a", "#cc4902", "#a1390b", "#8f2e14"
  ];

  // Process categories data
  const processCategories = (categories) => {
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return [];
    }

    // Count category occurrences
    const categoryCounts = categories.reduce((acc, category) => {
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert to pie chart data format
    return Object.entries(categoryCounts).map(([label, value], index) => ({
      id: index,
      value,
      label,
    }));
  };

  const pieData = processCategories(categories);

  return (
    <Box sx={{ width: "100%" }}>
      {pieData.length > 0 ? (
        <PieChart
          height={300}
          series={[{
            data: pieData.map((item, index) => ({
              ...item,
              color: pieColors[index % pieColors.length],
            })),
            innerRadius: radius,
            arcLabel: null, // Remove all labels
            arcLabelMinAngle: 20,
          }]}
          slotProps={{
            legend: {
              hidden: true, // Hide the legend/color boxes
            },
            tooltip: { 
              // Customize tooltip to show category and count
              formatter: (params) => {
                if (params.label && params.value) {
                  return `${params.label}: ${params.value} event${params.value !== 1 ? 's' : ''}`;
                }
                return null;
              }
            }
          }}
        />
      ) : (
        <p className="flex justify-center text-orange-600 text-center border border-dashed p-8 m-14">
          Participate in events to see your contributions by category!
        </p>
      )}
    </Box>
  );
}