import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const CausesChart = ({ causesData }) => {
    // Define specific colors for each cause type
    const causeColors = {
        "Environmental": "#4CAF50",  // Green for environmental
        "Community Service": "#2196F3",  // Blue for community
        "Education": "#9C27B0",  // Purple for education
        "Healthcare": "#F44336",  // Red for healthcare
        "Animal Welfare": "#FF9800",  // Orange for animals
        "Disaster Relief": "#607D8B",  // Blue-gray for disaster
        "Lifestyle & Culture": "#E91E63",  // Pink for culture
        "Fundraising & Charity": "#009688"  // Teal for charity
    };

    // Convert causes to chart data with specific colors
    const data = causesData.map((cause, index) => ({
        id: index,
        value: 1, // Equal value for all causes
        label: cause,
        color: causeColors[cause] || "#" + Math.floor(Math.random()*16777215).toString(16) // Fallback random color
    }));

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: 2
        }}>
            <PieChart
                series={[{
                    data,
                    innerRadius: 50,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                    cx: 150,
                    cy: 100,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
                }]}
                colors={data.map(item => item.color)}
                width={400}
                height={250}
                slotProps={{
                    legend: {
                        direction: 'row',
                        padding: 0,
                        labelStyle: {
                            fontFamily: '"Roboto", sans-serif',
                        },
                    },
                }}
            />
            
            <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: 1, 
                mt: 2,
                maxWidth: '80%'
            }}>
            </Box>
        </Box>
    );
};

export default CausesChart;