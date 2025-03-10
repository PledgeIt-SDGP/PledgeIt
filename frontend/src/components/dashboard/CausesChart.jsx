import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';


const CausesChart = ({ causesData }) => {
    // Prepare data for Material-UI PieChart
    const data = causesData.map(cause => ({
      id: cause.name,
      value: cause.value,
      label: cause.name
    }));
    const colors = [
      "#FF6B6B", // Soft Coral
      "#FFD93D", // Golden Yellow
      "#4ECDC4", // Aqua Blue
      "#36A2EB", // Light Blue
      "#5B5F97", // Deep Indigo
      "#9B59B6", // Purple Plum
      "#20B2AA", // Teal Green
      "#2E8B57"  // Deep Green
    ];

    
  return (
    <Box sx={{ 
      width: '100%', 
      height: 340, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      backgroundColor:"",
      
    }}>
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
        width={550}
        height={250}
      />
      
    </Box>
  );
};
export default CausesChart;