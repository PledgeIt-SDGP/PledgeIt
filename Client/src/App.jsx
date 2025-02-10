import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/hero/HeroContent";
import { FooterWithSitemap } from "./components/nav&footer/Footer";
import Search from "./components/search/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/event" element={<Search />} />
      </Routes>
      <FooterWithSitemap />
    </Router>
  );
}

export default App;
