import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Hero";
import VolSignUp from "./pages/VolunteerSignupForm";
import OrgSignUp from "./pages/OrgSignupForm";
import UserPage from "./pages/UserPage";
import Login from "./pages/LoginForm"
import VolDash from "./pages/volunteer-dashboard"
import OrgDash from "./pages/organization-dashboard"

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page (Landing Page) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/VolSignUp" element={<VolSignUp />} />
        <Route path="/OrgSignUp" element={<OrgSignUp />} />
        <Route path="/Vol-Dashboard" element={<VolDash />} />
        <Route path="/Org-Dashboard" element={<OrgDash />} />
      </Routes>
    </Router>
  );
}

export default App;