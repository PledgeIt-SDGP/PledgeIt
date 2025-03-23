import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, Filter } from 'lucide-react';

const CalendarFeature = ({ organizationId }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'agenda'
  const [filters, setFilters] = useState({
    showVolunteerEvents: true,
    showExternalEvents: true
  });
  
  // Mock data - in a real implementation, this would come from the Google Calendar API
  const mockEvents = [
    {
      id: 'gc1',
      title: 'Board Meeting',
      start: new Date(2025, 2, 15, 10, 0),
      end: new Date(2025, 2, 15, 11, 30),
      location: 'Conference Room A',
      calendarType: 'google',
      colorId: 1 // Google Calendar color ID
    },
    {
      id: 'gc2',
      title: 'Donor Call',
      start: new Date(2025, 2, 16, 14, 0),
      end: new Date(2025, 2, 16, 15, 0),
      location: 'Zoom',
      calendarType: 'google',
      colorId: 2
    },
    {
      id: 'pl1',
      title: 'Beach Cleanup Drive',
      start: new Date(2025, 2, 15, 9, 0),
      end: new Date(2025, 2, 15, 12, 0),
      location: 'Sunset Beach',
      calendarType: 'platform',
      registeredVolunteers: 24
    },
    {
      id: 'pl2',
      title: 'Tech Skills Workshop',
      start: new Date(2025, 2, 22, 13, 0),
      end: new Date(2025, 2, 22, 16, 0),
      location: 'Community Center',
      calendarType: 'platform',
      registeredVolunteers: 18
    }
  ];

  // Function to simulate connecting to Google Calendar
  const connectGoogleCalendar = () => {
    setLoading(true);
    
    // In a real implementation, this would trigger OAuth flow
    setTimeout(() => {
      setConnected(true);
      setCalendarEvents(mockEvents);
      setLoading(false);
    }, 1000);
  };

  // Function to refresh calendar data
  const refreshCalendar = () => {
    setLoading(true);
    
    // In a real implementation, this would fetch fresh data from the API
    setTimeout(() => {
      setCalendarEvents(mockEvents);
      setLoading(false);
    }, 500);
  };

  // Function to navigate between months
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get month name and year
  const getMonthDisplay = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Filter events based on current filters
  const getFilteredEvents = () => {
    return calendarEvents.filter(event => {
      if (event.calendarType === 'platform' && !filters.showVolunteerEvents) return false;
      if (event.calendarType === 'google' && !filters.showExternalEvents) return false;
      return true;
    });
  };

  // Get event color based on type
  const getEventColor = (event) => {
    if (event.calendarType === 'platform') {
      return 'bg-gradient-to-r from-orange-500 to-red-500';
    }
    
    // Map Google Calendar colorId to tailwind colors
    const googleColors = {
      1: 'bg-blue-500',
      2: 'bg-green-500',
      3: 'bg-purple-500',
      4: 'bg-yellow-500',
      5: 'bg-red-500',
      6: 'bg-indigo-500',
      7: 'bg-pink-500',
      8: 'bg-gray-500',
      9: 'bg-teal-500',
      10: 'bg-amber-500',
      11: 'bg-cyan-500'
    };
    
    return googleColors[event.colorId] || 'bg-gray-500';
  };

  // Generate the days of the month for the calendar
  const generateCalendarDays = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100 bg-gray-50"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      
      // Get events for this day
      const dayEvents = getFilteredEvents().filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      });
      
      days.push(
        <div key={`day-${day}`} className="h-24 border border-gray-100 p-1 overflow-hidden">
          <div className="font-medium text-sm mb-1">
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-16">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`${getEventColor(event)} text-white text-xs p-1 rounded truncate cursor-pointer hover:opacity-90`}
                title={`${event.title} (${formatDate(event.start)} - ${formatDate(event.end)})`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Agenda view for upcoming events
  const renderAgendaView = () => {
    const today = new Date();
    const filteredEvents = getFilteredEvents().filter(event => new Date(event.start) >= today);
    filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    return (
      <div className="space-y-3 mt-4 max-h-96 overflow-y-auto p-2">
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No upcoming events found
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all">
              <div className="flex items-start">
                <div className={`${getEventColor(event)} w-1 h-full rounded-full mr-3 self-stretch`}></div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {event.start.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    , {formatDate(event.start)} - {formatDate(event.end)}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar size={14} className="mr-1" />
                    {event.location}
                  </div>
                  {event.calendarType === 'platform' && (
                    <div className="text-sm text-gray-600 mt-1">
                      {event.registeredVolunteers} volunteers registered
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {event.calendarType === 'google' ? 'Google Calendar' : 'PledgeIt Platform'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center">
          <Calendar size={20} className="mr-2 text-orange-500" />
          Calendar
        </h2>
        
        {!connected ? (
          <button 
            onClick={connectGoogleCalendar}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-4 h-4 mr-2" />
            Connect Google Calendar
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button 
              onClick={refreshCalendar}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Refresh Calendar"
            >
              <RefreshCw size={16} />
            </button>
            <button 
              onClick={() => window.open('https://calendar.google.com', '_blank')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Open in Google Calendar"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        )}
      </div>
      
      {connected && (
        <div className="mb-4 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded-lg ${view === 'month' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Month
            </button>
            <button
              onClick={() => setView('agenda')}
              className={`px-3 py-1 text-sm rounded-lg ${view === 'agenda' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Agenda
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <button 
              onClick={() => setFilters({...filters, showVolunteerEvents: !filters.showVolunteerEvents})}
              className={`px-3 py-1 text-xs rounded-full flex items-center ${filters.showVolunteerEvents ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <span className={`w-2 h-2 rounded-full mr-1 bg-gradient-to-r from-orange-500 to-red-500`}></span>
              Platform Events
            </button>
            <button 
              onClick={() => setFilters({...filters, showExternalEvents: !filters.showExternalEvents})}
              className={`px-3 py-1 text-xs rounded-full flex items-center ${filters.showExternalEvents ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              <span className="w-2 h-2 rounded-full mr-1 bg-blue-500"></span>
              Google Events
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : !connected ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-6">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" 
            alt="Google Calendar" 
            className="w-16 h-16 mb-4 opacity-50" 
          />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Connect Google Calendar</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Integrate your Google Calendar to see all your events alongside volunteer activities in one place.
          </p>
          <button 
            onClick={connectGoogleCalendar}
            className="flex items-center px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-4 h-4 mr-2" />
            Connect Now
          </button>
        </div>
      ) : view === 'month' ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={16} />
            </button>
            <h3 className="text-md font-medium">{getMonthDisplay()}</h3>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-0">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {generateCalendarDays()}
          </div>
        </div>
      ) : (
        renderAgendaView()
      )}
      
      {connected && (
        <div className="mt-6 text-center">
          <a 
            href="/calendar"
            className="text-sm text-orange-600 hover:text-orange-800 font-medium"
          >
            View Full Calendar
          </a>
        </div>
      )}
    </div>
  );
};

export default CalendarFeature;