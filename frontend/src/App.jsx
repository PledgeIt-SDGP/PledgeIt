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
import OrganizationDashboard from "./pages/OrganizationDashboard"
import { UserProvider } from "./hooks/UserContext"

function App() {
  return (
    <UserProvider>
      <Router>
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
      </Router>
    </UserProvider>
  );
}

export default App;
