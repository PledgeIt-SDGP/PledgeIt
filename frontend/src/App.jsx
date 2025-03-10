import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EventForm from "./pages/EventForm";
import OrgSignupForm from "./components/auth/OrgSignupForm";
import VolunteerSignupForm from "./components/auth/VolunteerSignupForm";
import Example from "./example";
import UserPage from "./pages/UserPage";
import LoginForm from "./components/auth/LoginForm";
import OrgSettings from "./components/dashboard/OrgSettings";
import OrganizationDashboard from "./pages/OrganizationDashboard";
import OrgHome from "./components/dashboard/OrgHome";
import OrgProfile from "./components/dashboard/OrgProfile";




function App() {
  return (
    <Router>
      <Routes>

        <Route path="/eventForm" element={<EventForm />} />
        <Route path="/orgSignup" element={<OrgSignupForm />} />
        <Route path="/volSignup" element={<VolunteerSignupForm />} />



        <Route path="/ex" element={<Example />} />
        <Route path="/userpage" element={<UserPage />} />
        <Route path="/set" element={<OrgSettings />} />
        <Route path="/orgHome" element={<OrgHome />} />
        <Route path="/profile" element={<OrgProfile />} />

        <Route path="/dash" element={<OrganizationDashboard />} />
        <Route path="/login" element={<LoginForm />} />



      </Routes>
    </Router>
  );
}

export default App;
