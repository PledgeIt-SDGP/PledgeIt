import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Hero";
import VolSignUp from "./pages/VolunteerSignupForm";
import OrgSignUp from "./pages/OrgSignupForm";
import UserPage from "./pages/UserPage";
import Login from "./pages/LoginForm"

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
      </Routes>
    </Router>
  );
}

export default App;