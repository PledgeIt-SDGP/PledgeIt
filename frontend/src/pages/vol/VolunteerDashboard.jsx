import { useState } from "react";
import Sidebar from "../../components/vol-dash/VolSidebar";
import Chatbox from "../../components/Chatbot";

const VolunteerDashboard = ({ children }) => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);

  const toggleChatbox = () => {
    setIsChatboxOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-100">{children}</main>
        
      {/* Render Chatbox component with isOpen prop */}
      <Chatbox isOpen={isChatboxOpen} toggleChat={toggleChatbox} />
    </div>
  );
};

export default VolunteerDashboard;