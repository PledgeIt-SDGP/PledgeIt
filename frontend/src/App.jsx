import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import SearchFilters from "./pages/SearchFilter";
import EventDetails from "./components/eventDetails/EventDetails";
import HomeEvent from "./components/home/HomeEvent";
import VolunteerHome from "./components/volunteerDashboard/VolunteerHome";
import VolunteerDashboard from "./pages/VolunteerDashboard";

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

      </Routes>
    </Router>
  );
}

export default App;
