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

      {/* Floating Chatbox Button */}
      <button
        onClick={toggleChatbox}
        className="fixed bottom-5 right-5 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg transform transition duration-300 hover:scale-110"
      >
        💬
      </button>

      {/* Chatbox Modal */}
      {isChatboxOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out backdrop-blur-md">
          {}
          <div className="w-[350px] h-[550px]">
            {}
            <div className="flex-1 p-4 overflow-y-auto">
              <Chatbox />
            </div>

            {/* Close Button */}
            <button
              onClick={toggleChatbox}
              className="absolute top-2 right-2 text-black text-3xl font-bold hover:text-red-600 transition-colors duration-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;
