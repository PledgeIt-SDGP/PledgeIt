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

const AppRoutes = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AppRoutes useEffect triggered"); // Debugging: Check if useEffect runs
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    console.log("Token:", token, "UserRole:", userRole); // Debugging: Check token and role

    if (token && userRole) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Fetched user data:", response.data); // Debugging: Check fetched data
          setUser(response.data); // Update user context with fetched data

          // Check the current path before navigating
          const currentPath = window.location.pathname;
          // Only redirect from the root, login, or signup pages
          const authPages = ['/', '/login', '/VolSignUp', '/OrgSignUp'];
          if (userRole === 'volunteer' && authPages.includes(currentPath)) {
            console.log("Navigating to /VolHome");
            navigate('/VolHome');
          } else if (userRole === 'organization' && authPages.includes(currentPath)) {
            console.log("Navigating to /OrgHome");
            navigate('/OrgHome');
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          navigate('/login');
        } finally {
          setIsLoading(false); // Set loading to false after fetching data
        }
      };

      fetchUserData();
    } else {
      setIsLoading(false); // Set loading to false if no token or userRole
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading spinner or message
  }

  return (
    <Routes>
      {/* Show HomePage only if user is not logged in */}
      {!user && <Route path="/" element={<HomePage />} />}

      {/* Redirect logged-in users to their respective home pages */}
      {user && user.role === 'volunteer' && <Route path="/" element={<VolunteerHome />} />}
      {user && user.role === 'organization' && <Route path="/" element={<OrganizationHome />} />}

      <Route path="/UserPage" element={<UserPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/VolSignUp" element={<VolSignUp />} />
      <Route path="/OrgSignUp" element={<OrgSignUp />} />

      <Route path="/VolHome" element={<VolunteerHome />} />
      <Route path="/VolEvents" element={<SearchFilters />} />
      <Route path="/latestEvents" element={<HomeEvent />} />
      <Route path="/details" element={<EventDetails />} />
      <Route path="/details/:id" element={<EventDetails />} />
      <Route path="/VolMap" element={<VolunteerMap />} />
      <Route path="/VolSettings" element={<VolunteerSettings />} />

      <Route path="/OrgHome" element={<OrganizationHome />} />
      <Route path="/eventform" element={<EventForm />} />
      <Route path="/OrgEvents" element={<OrganizationEvents />} />
      <Route path="/OrgProfile" element={<OrganizationProfile />} />
      <Route path="/OrgSettings" element={<OrganizationSettings />} />
    </Routes>
  );
};

export default AppRoutes;