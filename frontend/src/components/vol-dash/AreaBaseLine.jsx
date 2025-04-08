import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useUser } from "../../hooks/UserContext";
import { Box } from "@mui/material";

export default function AreaBaseline() {
  const { user } = useUser();
  const totalPoints = user?.points || 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const xpData = [0, 0, 0, totalPoints, 0, 0, 0, 0, 0, 0, 0, 0];

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      p: 3
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: '700px',
        height: '380px',
        position: 'relative'
      }}>
        <LineChart
          xAxis={[{
            data: months,
            scaleType: 'point',
            tickLabelStyle: {
              fill: '#6B7280',
              fontSize: 12
            }
          }]}
          yAxis={[{
            tickLabelStyle: {
              fill: '#6B7280',
              fontSize: 12
            }
          }]}
          series={[{
            data: xpData,
            area: true,
            showMark: ({ index }) => index === 3,
            color: '#E74C3C',
            curve: 'natural'
          }]}
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
              opacity: 0.2,
            },
            "& .MuiChartsAxis-line": {
              stroke: '#E5E7EB',
            },
            "& .MuiChartsAxis-tick": {
              stroke: '#E5E7EB',
            },
          }}
        >
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E74C3C" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
    </Box>
  );
}