// PieAnimation.js
import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { Categories, valueFormatter } from "./webUsageStats";

export default function PieAnimation() {
  const [radius, setRadius] = React.useState(100);
  const [itemNb, setItemNb] = React.useState(Categories.length);
  const [skipAnimation, setSkipAnimation] = React.useState(false);

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
    <Box sx={{ width: "100%" }}>
      <PieChart
        height={300}
        series={[
          {
            data: Categories.slice(0, itemNb).map((item, index) => ({
              ...item,
              color: pieColors[index % pieColors.length], // Cycle through custom colors
            })),
            innerRadius: radius,
            arcLabel: null, // Remove the label by setting it to null
            arcLabelMinAngle: 20,
            valueFormatter,
          },
        ]}
      />
    </Box>
  );
}
