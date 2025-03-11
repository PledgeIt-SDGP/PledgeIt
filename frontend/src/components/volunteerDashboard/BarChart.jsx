import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function ChartsOverviewDemo() {
  return (
    <BarChart
      series={[
        { data: [35, 44, 24, 34] ,color: "#4caf50"},
        { data: [51, 6, 49, 30], color: "#2196f3" },
        { data: [15, 25, 30, 50],color: "#ff9800" },
        { data: [60, 50, 15, 25],color:"#e91e63" },
      ]}
      height={290}
      xAxis={[{ data: ["Q1", "Q2", "Q3", "Q4"], scaleType: "band" }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}
