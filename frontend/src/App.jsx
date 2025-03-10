import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/loading/SplashScreen";
import HomePage from "./pages/HomePage";
import EventMap from "./pages/EventMap";
import CreateEventPage from "./pages/CreateEventPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Splash Screen appears at "/" */}
        <Route path="/" element={<SplashScreen />} />

        {/* Homepage route */}
        <Route path="/home" element={<HomePage />} />

        {/* Other routes */}
        <Route path="/events" element={<EventMap />} />

        {/* Create Event Page */}
        <Route path="/create-event" element={<CreateEventPage />} />
      </Routes>
    </Router>
  );
}

export default App;
