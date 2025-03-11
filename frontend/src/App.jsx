import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchFilters from "./pages/SearchFilter";
import EventDetails from "./components/eventDetails/EventDetails";
import HomeEvent from "./components/home/HomeEvent";
import VolunteerHome from "./components/volunteerDashboard/VolunteerHome";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import OrgSignUp from "./components/auth/OrgSignupForm";
import VolSignUp from "./components/auth/VolunteerSignupForm";
import UserPage from "./pages/UserPage";
import Login from "./components/auth/LoginForm";

function App() {
  return (
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
        <Route path="/volunteerHome" element={<VolunteerHome />} />
        <Route path="/dashboard" element={<VolunteerDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
