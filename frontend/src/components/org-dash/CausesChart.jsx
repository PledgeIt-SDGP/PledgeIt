import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CausesChart = ({ eventsData }) => {
    const theme = useTheme();
    // Define specific colors for each cause type
    const causeColors = {
        "Environmental": "#4CAF50",
        "Community Service": "#2196F3",
        "Education": "#9C27B0",
        "Healthcare": "#F44336",
        "Animal Welfare": "#FF9800",
        "Disaster Relief": "#607D8B",
        "Lifestyle & Culture": "#E91E63",
        "Fundraising & Charity": "#009688"
    };

    // Handle empty or invalid data
    if (!eventsData || eventsData.length === 0) {
        return (
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Typography variant="body2">No events data available</Typography>
            </Box>
        );
    }

    // Count occurrences of each category
    const causeCounts = eventsData.reduce((acc, event) => {
        const category = event.category || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    // Convert to chart data with counts
    const data = Object.entries(causeCounts).map(([cause, count], index) => ({
        id: index,
        value: count,
        label: cause,
        color: causeColors[cause] || "#" + Math.floor(Math.random() * 16777215).toString(16)
    }));

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <PieChart
                series={[{
                    data,
                    innerRadius: 50,  // Increased inner radius
                    outerRadius: 120, // Increased outer radius
                    paddingAngle: 2,
                    cornerRadius: 5,
                    cx: 180,         // Adjusted center position
                    cy: 150,         // Adjusted center position
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                }]}
                colors={data.map(item => item.color)}
                width={400}          // Increased width
                height={350}         // Increased height
                slotProps={{
                    legend: {
                        direction: 'row',
                        position: { vertical: 'bottom', horizontal: 'middle' },
                        padding: { top: 20 },
                        itemMarkWidth: 10,
                        itemMarkHeight: 10,
                        labelStyle: {
                            fontSize: theme.typography.body2.fontSize,
                            fontFamily: theme.typography.fontFamily,
                        },
                    },
                }}
                margin={{ top: 20, bottom: 60, left: 20, right: 20 }}
            />
        </Box>
    );
};

export default CausesChart;