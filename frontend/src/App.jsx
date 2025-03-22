import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchFilters from "./pages/vol/SearchFilter";
import EventDetails from "./components/eventDetails/EventDetails";
import HomeEvent from "./components/home/HomeEvent";
import VolunteerHome from "./pages/vol/VolunteerHome";
import VolunteerDashboard from "./pages/vol/VolunteerDashboard";
import VolunteerSettings from "./pages/vol/VolunteerSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event" element={<SearchFilters />} />
        <Route path="/latestEvents" element={<HomeEvent />} />
        <Route path="/details" element={<EventDetails />} />
        <Route path="/details/:id" element={<EventDetails />} />
        <Route path="/volunteerHome" element={<VolunteerHome />} />
        <Route path="/dashboard" element={<VolunteerDashboard />} />
        <Route path="/volunteerSettings" element={<VolunteerSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
