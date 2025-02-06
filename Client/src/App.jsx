import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import VolunteerSignUpPage from "./pages/VolunteerSignUpPage";
import OrgSignUp from "./components/forms/OrgSignUp";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />

        <Route path="/signup" element={<VolunteerSignUpPage/>}/>
        <Route path="/orgSignup" element={<OrgSignUp/>} />
      </Routes>
    </Router>
  );
}

export default App;
