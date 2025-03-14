import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';

const CausesChart = () => {
  const [causesData, setCausesData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/dashboard/causes')
      .then(response => response.json())
      .then(data => setCausesData(data))
      .catch(error => console.error('Error fetching causes data:', error));
  }, []);

  // Prepare data for Material-UI PieChart
  const data = causesData.map(cause => ({
    id: cause.name,
    value: cause.value,
    label: cause.name
  }));

  const colors = [
    "#8B0000", // Dark Red
    "#B22222", // Firebrick Red
    "#DC143C", // Crimson Red
    "#FF4500", // Orange Red
    "#FF6347", // Tomato Orange
    "#FF8C00", // Dark Orange
    "#FFA500", // Orange
    "#FFD700", // Gold
    "#FFB6C1"  // Light Pink (Soft Red Hue)
  ];

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      backgroundColor: "",
      marginTop: "40px",
    }}>
      <h2>Dashboard - Causes Overview</h2>
      <PieChart
        series={[
          {
            data,
            innerRadius: 40,
            outerRadius: 120,
            paddingAngle: 1,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
            cx: 150,
            cy: 120,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 20, additionalRadius: -10, color: 'gray' },
          }
        ]}
        colors={colors}
        width={500}
        height={250}
      />
    </Box>
  );
};

export default CausesChart;
