// CreateEventPage.jsx
import React from "react";
import EventForm from "../components/form/EventForm"; // Adjust the path as necessary

const CreateEventPage = () => {
  return (
    <div>
      <h1 className="text-center text-3xl font-bold mt-8">Create New Event</h1>
      <EventForm />
    </div>
  );
};

export default CreateEventPage;
