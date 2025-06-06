import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useUser } from "./hooks/UserContext";
import HomePage from "./pages/Home";
import SearchFilters from "./pages/vol/SearchFilter";
import EventDetails from "./components/eventDetails/EventDetails";
import HomeEvent from "./components/home/HomeEvent";
import OrgSignUp from "./components/auth/OrgSignupForm";
import VolSignUp from "./components/auth/VolunteerSignupForm";
import UserPage from "./pages/UserPage";
import Login from "./components/auth/LoginForm";
import OrganizationHome from "./pages/org/OrgHome";
import OrganizationSettings from "./pages/org/OrgSettings";
import OrganizationProfile from "./pages/org/OrgProfile";
import OrganizationEvents from "./pages/org/AllEvents";
import VolunteerHome from "./pages/vol/VolunteerHome";
import VolunteerMap from "./pages/vol/EventMap";
import VolunteerSettings from "./pages/vol/VolunteerSettings";
import EventForm from "./pages/org/EventForm";
import SplashScreen from "./components/loading/SplashScreen";
import OrganizationEventsUpdate from "./components/event/UpdateEvent";
import TermsAndConditions from "./pages/TermsAndConditions";
import AttendanceConfirmation from "./components/vol-dash/AttendanceConfirmation";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (token && userRole) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("https://pledgeit-backend-ihkh.onrender.com/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          setUser(response.data);
          
          const currentPath = window.location.pathname;
          const authPages = ['/', '/login', '/VolSignUp', '/OrgSignUp'];
          
          if (userRole === 'volunteer' && authPages.includes(currentPath)) {
            navigate('/VolHome');
          } else if (userRole === 'organization' && authPages.includes(currentPath)) {
            navigate('/OrgHome');
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setUser(null);
          navigate('/login');
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    } else {
      setIsLoading(false);
      if (user) setUser(null);
    }
  }, [navigate, setUser]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Home route with conditional rendering */}
      <Route 
        path="/" 
        element={
          !user ? <HomePage /> : 
          user.role === 'volunteer' ? <VolunteerHome /> : 
          <OrganizationHome />
        } 
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/VolSignUp" element={<VolSignUp />} />
      <Route path="/OrgSignUp" element={<OrgSignUp />} />

      {/* Volunteer routes */}
      {user?.role === 'volunteer' && (
        <>
          <Route path="/volHome" element={<VolunteerHome />} />
          <Route path="/VolEvents" element={<SearchFilters />} />
          <Route path="/VolMap" element={<VolunteerMap />} />
          <Route path="/VolSettings" element={<VolunteerSettings />} />
          <Route path="/events/:eventId/confirm" element={<AttendanceConfirmation />} />
        </>
      )}

      {/* Organization routes */}
      {user?.role === 'organization' && (
        <>
          <Route path="/orgHome" element={<OrganizationHome />} />
          <Route path="/eventform" element={<EventForm />} />
          <Route path="/orgEvents" element={<OrganizationEvents />} />
          <Route path="/orgEventsUpdate/:eventId" element={<OrganizationEventsUpdate />} />
          <Route path="/orgProfile" element={<OrganizationProfile />} />
          <Route path="/orgSettings" element={<OrganizationSettings />} />
        </>
      )}

      {/* Common routes */}
      <Route path="/UserPage" element={<UserPage />} />
      <Route path="/latestEvents" element={<HomeEvent />} />
      <Route path="/details" element={<EventDetails />} />
      <Route path="/details/:id" element={<EventDetails />} />
      <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
    </Routes>
  );
};

export default AppRoutes;