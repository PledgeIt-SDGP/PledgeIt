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
import { motion } from 'framer-motion';

// Mock data to demonstrate the component
const mockVolunteers = [
  {
    id: "v001",
    name: "John Doe",
    events: 12,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "v002",
    name: "Jane Smith",
    events: 10,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: "v003",
    name: "Alice Johnson",
    events: 8,
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "v004",
    name: "Bob Brown",
    events: 7,
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
  },
  {
    id: "v005",
    name: "Charlie Davis",
    events: 6,
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Set volunteers data after "fetch" simulation
      setVolunteers(mockVolunteers);
      setLoading(false);
    };

    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <Card 
      sx={{ 
        minWidth: 300, 
        maxWidth: "90%", 
        mx: 'auto', 
        boxShadow: 0,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <CardContent>


        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {volunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ListItem 
                  sx={{
                    mb: 1,
                    bgcolor: index < 3 ? 'rgba(134, 13, 13, 0.08)' : 'rgba(243, 37, 37, 0.08)',
                    borderRadius: 3,
                    border: index < 3 ? '1px solid rgba(103, 2, 2, 0.3)' : 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 2,
                    }
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
                      <Typography variant="subtitle1" fontWeight="medium " paddingLeft={2}>
                        {volunteer.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={`${volunteer.events} events`} 
                            size="small" 
                            variant="outlined" 
                          
                            sx={{ 
                              bgcolor: 'gray.100',
                              borderColor: 'gray.500',
                              color: 'black',
                              marginLeft:2,
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </motion.div>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TopVolunteers;