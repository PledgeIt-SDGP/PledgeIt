import { BrowserRouter as Router } from "react-router-dom"; // Import Router
import { UserProvider } from "./hooks/UserContext"; // Import UserProvider
import AppRoutes from "./AppRoutes"; // Import AppRoutes
import "./App.css"; // Import App.css

function App() {
    return (
        <Router>
            <UserProvider>
                <AppRoutes /> {/* Render the AppRoutes component inside the Router */}
            </UserProvider>
        </Router>
    );
}

export default App; // Export App only once