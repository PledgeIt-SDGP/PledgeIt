import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useUser } from "../../hooks/UserContext";
import { Typography, Box, Paper } from "@mui/material";

export default function AreaBaseline() {
  const { user } = useUser();
  const totalPoints = user?.points || 0;

  // Months data - all points assigned to April (index 3)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const xpData = [0, 0, 0, totalPoints, 0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      width: '100%',
      p: 2
    }}>
      <Box sx={{ 
        width: '100%', 
        maxWidth: '500px', 
        margin: '0 auto' 
      }}>
        <LineChart
          xAxis={[{
            data: months,
            scaleType: 'point',
          }]}
          yAxis={[{
          }]}
          series={[{
            data: xpData,
            area: true,
            showMark: ({ index }) => index === 3, // Only show marker for April
            color: '#E74C3C',
          }]}
          width={400}
          height={300}
          margin={{ top: 30, bottom: 50, left: 50, right: 30 }}
          sx={{
            "& .MuiLineElement-root": {
              stroke: '#E74C3C',
              strokeWidth: 3,
            },
            "& .MuiMarkElement-root": {
              stroke: '#E74C3C',
              scale: '1.5',
              fill: '#fff',
              strokeWidth: 2,
            },
            "& .MuiAreaElement-root": {
              fill: 'url(#xpGradient)',
              opacity: 0.3,
            },
          }}
        >
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E74C3C" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Box>
  );
}