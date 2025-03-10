import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Chip, 
  Box,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

// Mock data to demonstrate the component
const mockVolunteers = [
  {
    id: "v001",
    name: "bla1",
    events: 12,
    avatar: "https://randomuser.me//portraits/women/68.jpg",
  },
  {
    id: "v002",
    name: "bla2",
    events: 10,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "v003",
    name: "bla3",
    events: 8,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: "v004",
    name: "bla4",
    events: 7,
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
  },
  {
    id: "v005",
    name: "bla5",
    events: 6,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  }
];

const TopVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set volunteers data after "fetch" simulation
      setVolunteers(mockVolunteers);
      setLoading(false);
    };

    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <Card sx={{ minWidth: 300, maxWidth: 450, mx: 'auto' }}>
      <CardContent>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {volunteers.map((volunteer, index) => (
              <ListItem 
                key={volunteer.id}
                sx={{
                  mb: 1,
                  bgcolor: index < 3 ? 'rgba(134, 13, 13, 0.08)' : 'rgba(243, 37, 37, 0.08)',
                  borderRadius: 5,
                  border: index < 3 ? '1px solid rgba(103, 2, 2, 0.3)' : 'none'
                }}
              >
                <ListItemAvatar>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar 
                      src={volunteer.avatar} 
                      alt={volunteer.name}
                      sx={{ 
                        border: index === 0 ? '2px solid gold' : 
                              index === 1 ? '2px solid silver' :
                              index === 2 ? '2px solid #cd7f32' : 'none',
                        width: 50,
                        height: 50,
                        marginLeft: 1,
                        
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    {index < 3 && (
                      <Chip
                        size="small"
                        label={`#${index + 1}`}
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: -5,
                          bgcolor: index === 0 ? 'gold' : 
                                  index === 1 ? 'silver' : '#cd7f32',
                          color: index === 0 ? 'black' : 'white',
                          fontWeight: 'bold',
                          fontSize: 10,
                          height: 20
                        }}
                      />
                    )}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {volunteer.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
                        <Chip 
                          label={`${volunteer.events} events`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

      </CardContent>
    </Card>
  );
};

export default TopVolunteers;
