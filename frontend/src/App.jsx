import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EventMap from "./pages/EventMap";
import CreateEventPage from "./pages/CreateEventPage"; // Import your new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page (Landing Page) */}
        <Route path="/" element={<HomePage />} />

        {/* Events Page with Interactive Map */}
        <Route path="/events" element={<EventMap />} />

        {/* Create Event Page */}
        <Route path="/create-event" element={<CreateEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
