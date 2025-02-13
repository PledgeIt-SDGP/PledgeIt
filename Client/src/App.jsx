import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VolunteerSignUpPage from "./pages/VolunteerSignUpPage";
// import OrgSignUp from "./components/forms/OrgSignUp";
import Hero from "./components/hero/HeroContent";
import { FooterWithSitemap } from "./components/nav&footer/Footer";
import Search from "./components/search/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signup" element={<VolunteerSignUpPage />} />
        {/* <Route path="/orgSignup" element={<OrgSignUp/>} /> */}
        <Route path="/event" element={<Search />} />
      </Routes>
      {/* <FooterWithSitemap /> */}
    </Router>
  );
}

export default App;