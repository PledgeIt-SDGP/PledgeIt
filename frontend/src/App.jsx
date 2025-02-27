import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Hero";
import EventMap from "./pages/EventMap";
import VolSignUp from "./pages/VolunteerSignupForm";
import OrgSignUp from "./pages/OrgSignupForm";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page (Landing Page) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/VolSignUp" element={<VolSignUp />} />
        <Route path="/OrgSignUp" element={<OrgSignUp />} />
        
        {/* Events Page with Interactive Map */}
        <Route path="/events" element={<EventMap />} />
      </Routes>
    </Router>
  );
}

export default App;