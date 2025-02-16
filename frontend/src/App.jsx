import "./styles/index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import EventMap from "./views/EventMap";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page (Landing Page) */}
        <Route path="/" element={<HomePage />} />

        {/* Events Page with Interactive Map */}
        <Route path="/events" element={<EventMap />} />
      </Routes>
    </Router>
  );
}

export default App;
