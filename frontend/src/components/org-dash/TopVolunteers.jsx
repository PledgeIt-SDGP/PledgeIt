import React, { useState, useEffect } from 'react';



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
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {volunteers.map((volunteer, index) => {
            // Determine background color based on index
            const bgClass = index < 3 
              ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-red-100' 
              : 'bg-gray-50 border border-gray-100';
            
          
            return (
              <div 
                key={volunteer.id}
                className={`rounded-xl ${bgClass} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md overflow-hidden`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                  animation: 'fadeIn 0.5s forwards',
                }}
              >
                <div className="relative p-1.5">
                  <div className="flex items-center">
                    <div className="relative">
                      {/* Avatar with conditional border */}
                      <div className={`relative h-10 w-10 rounded-full overflow-hidden ml-4 ${
                        index === 0 ? 'ring-2 ring-yellow-400' : 
                        index === 1 ? 'ring-2 ring-gray-300' :
                        index === 2 ? 'ring-2 ring-amber-700' : ''
                      }`}>
                        <img 
                          src={volunteer.avatar} 
                          alt={volunteer.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                    </div>
                    
                    <div className="ml-5 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {volunteer.name}
                          </h3>
                          <div className="flex space-x-2 mt-1">
                            <span className="text-xs bg-orange-100 text-orange-900 px-2 py-1 rounded-full">
                              {volunteer.events} events
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent p-3">
                          #{index + 1}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TopVolunteers;