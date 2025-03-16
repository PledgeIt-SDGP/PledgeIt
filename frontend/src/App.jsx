import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchFilters from "./pages/SearchFilter";
import EventDetails from "./components/eventDetails/EventDetails";
import HomeEvent from "./components/home/HomeEvent";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrgSignUp from "./components/auth/OrgSignupForm";
import VolSignUp from "./components/auth/VolunteerSignupForm";
import UserPage from "./pages/UserPage";
import Login from "./components/auth/LoginForm";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import { UserProvider } from "./hooks/UserContext";
import { useEffect } from "react";
import { useUser } from "./hooks/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create a new component to handle routing logic
const AppRoutes = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Fetched user data:", response.data); // Log the fetched data
          setUser(response.data); // Update user context with fetched data
          if (userRole === "volunteer") {
            navigate("/volDash");
          } else if (userRole === "organization") {
            navigate("/orgDash");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          navigate("/login");
        }
      };

      fetchUserData();
    }
  }, [navigate, setUser]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/UserPage" element={<UserPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/VolSignUp" element={<VolSignUp />} />
      <Route path="/OrgSignUp" element={<OrgSignUp />} />
      <Route path="/event" element={<SearchFilters />} />
      <Route path="/latestEvents" element={<HomeEvent />} />
      <Route path="/details" element={<EventDetails />} />
      <Route path="/details/:id" element={<EventDetails />} />
      <Route path="/VolDash" element={<VolunteerDashboard />} />
      <Route path="/OrgDash" element={<OrganizationDashboard />} />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes /> {/* Render the AppRoutes component inside the Router */}
      </Router>
    </UserProvider>
  );
}

export default App;