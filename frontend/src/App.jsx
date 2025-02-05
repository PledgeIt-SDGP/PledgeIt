import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/")
            .then(response => setMessage(response.data.message))
            .catch(error => console.error("Error:", error));
    }, []);

    return (
        <div>
            <h1>React + FastAPI</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
