import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};
