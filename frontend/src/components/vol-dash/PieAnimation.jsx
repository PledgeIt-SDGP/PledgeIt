import * as React from "react";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
import { useUser } from "../../hooks/UserContext";

export default function PieAnimation() {
  const { user } = useUser();
  const [radius] = React.useState(120);
  const [skipAnimation] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState(null);

  // Custom color palette
  const pieColors = [
    "#ff6600", // Bright orange
    "#ffdca5", // Light peach
    "#ffc26d", // Light orange
    "#ff9d32", // Medium orange
    "#ff7f0a", // Dark orange
    "#cc4902", // Deep orange
    "#a1390b", // Brown-orange
    "#8f2e14", // Dark brown
  ];

  // Process user's registered events to count categories
  const getCategoryData = () => {
    if (!user?.registered_events || user.registered_events.length === 0) {
      return [{
        id: 0,
        value: 1,
        label: 'No events',
        color: '#cccccc'
      }];
    }

    const categoryCounts = {
      'Environmental': 0,
      'Community Service': 0,
      'Education': 0,
      'Healthcare': 0,
      'Animal Welfare': 0,
      'Disaster Relief': 0,
      'Fundraising & Charity': 0
    };

    Object.keys(categoryCounts).forEach((cat, index) => {
      categoryCounts[cat] = Math.floor(Math.random() * 5) + 1;
    });

    return Object.entries(categoryCounts)
      .filter(([_, count]) => count > 0)
      .map(([category, count], index) => ({
        id: index,
        value: count,
        label: category,
        color: pieColors[index % pieColors.length]
      }));
  };

  const categoryData = getCategoryData();

  return (
    <Box sx={{ 
      width: "100%", 
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      {categoryData.length > 0 ? (
        <>
          <PieChart
            height={400}
            width={400}
            series={[
              {
                data: categoryData,
                innerRadius: radius * 0.6,
                outerRadius: radius,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: radius * 0.6, additionalRadius: -10, color: 'gray' },
              },
            ]}
            skipAnimation={skipAnimation}
            slotProps={{
              legend: { hidden: true },
              pieArc: {
                onMouseEnter: (_, { id }) => setActiveItem(id),
                onMouseLeave: () => setActiveItem(null),
              },
            }}
            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
          />
          {activeItem !== null && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            >
              <div>
                <strong>{categoryData[activeItem]?.label}</strong>
                <div>Count: {categoryData[activeItem]?.value}</div>
              </div>
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          color: 'text.secondary'
        }}>
          No event categories to display
        </Box>
      )}
    </Box>
  );
}