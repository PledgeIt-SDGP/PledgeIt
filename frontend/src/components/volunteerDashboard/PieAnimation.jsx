// PieAnimation.js
import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { categories, Categories, valueFormatter } from "./webUsageStats";

export default function PieAnimation() {
  // Custom red and orange shades for each section
  const pieColors = [
    "#ff6600",
    "#ffdca5",
    "#ffc26d",
    "#ff9d32",
    "#ff7f0a",
    "#cc4902",
    "#a1390b",
    "#8f2e14",
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <PieChart
        width={500}
        height={250}

        series={[
          {
            data: Categories.slice(0, categories.length).map((item, index) => ({
              ...item,
              color: pieColors[index % pieColors.length], // Cycle through custom colors
            })),
            innerRadius: 0,
            arcLabel: null, // Remove the label by setting it to null
            arcLabelMinAngle: 20,
            valueFormatter,
          },
        ]}
      />
    </Box>
  );
}
