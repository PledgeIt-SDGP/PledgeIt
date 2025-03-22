// AreaBaseline.js
import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";

export default function AreaBaseline() {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 960px)");
  const isLargeScreen = useMediaQuery("(max-width: 1280px)");

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
    <LineChart
      xAxis={[{ data: [1, 2, 3, 4 , 5, 6, 7 ,8 ,9, 10, 11, 12] }]}
      series={[
        {
          data: [10, 22, 8, 30, 50, 60, 30, 40, 50, 60, 70, 80],
          scaleType: "linear",
          label: "XP points",
          axisLine: { stroke: "#D1D5DB", strokeWidth: 1 }, // Axis line styling
        },
      ]}
      
      width={isSmallScreen ? 500 : isMediumScreen ? 500 : 600 } 
      height={isSmallScreen ? 400 : isMediumScreen ? 400 : 300 }

      sx={{
        "& .MuiLineElement-root": { stroke: "#E74C3C" }, // Line stroke 
        "& .MuiAreaElement-root": {
          opacity: 0.8,
        },
      }}
    />
    </Box>
  );
}
