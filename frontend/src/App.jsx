import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./hooks/UserContext";
import AppRoutes from "./AppRoutes";
import "./App.css";

function App() {
    return (
        <Router>
            <UserProvider>
                <AppRoutes />
            </UserProvider>
        </Router>
    );
}

export default App;