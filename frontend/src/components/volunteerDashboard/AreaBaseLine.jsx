// AreaBaseline.js
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function AreaBaseline() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, -5.5, 2, -7.5, 1.5, 6],
          scaleType: "linear",
          label: "Time (Days)",
          tickLabelStyle: { fill: "#6B7280", fontSize: "12px" }, // Axis tick styling
          axisLine: { stroke: "#D1D5DB", strokeWidth: 1 }, // Axis line styling
        },
      ]}
      
      width={500}
      height={300}
      sx={{
        "& .MuiLineElement-root": { stroke: "#E74C3C" }, // Line stroke 
        "& .MuiAreaElement-root": {
          fill: "linear-gradient(to top,#FF69B4,#FF69B4)", // Gradient fill (Tomato to Orange)
          opacity: 0.8,
        },
      }}
    />
  );
}
