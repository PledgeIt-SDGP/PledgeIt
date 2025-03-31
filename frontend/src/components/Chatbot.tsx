import React, { useState, useRef } from "react";
import "../Chatbot.css";

// Update the interface to accept props
interface ChatboxProps {
  isOpen?: boolean;
  toggleChat?: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ isOpen = false, toggleChat }) => {
  const [messages, setMessages] = useState<any[]>([]);
  // Only use internal state if no external state is provided
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Use either the prop or internal state
  const chatboxIsOpen = isOpen !== undefined ? isOpen : internalIsOpen;
  
  const toggleState = () => {
    if (toggleChat) {
      // Use external toggle if provided
      toggleChat();
    } else {
      // Otherwise use internal state
      setInternalIsOpen((prevState) => !prevState);
    }
  };

  const onSendButton = () => {
    const text = inputRef.current?.value;
    if (!text || text.trim() === "") return;

    const newMessage = { name: "User", message: text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Make the API call to the backend
    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      body: JSON.stringify({ message: text }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((r) => {
        const botMessage = { name: "Sam", message: r.answer };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        if (inputRef.current) inputRef.current.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
        if (inputRef.current) inputRef.current.value = "";
      });
  };

  return (
    <div className="container" style={{ position: 'fixed', bottom: 10, right: 0, zIndex: 1000 }}>
      <div className="chatbox">
        <div className={`chatbox__support ${chatboxIsOpen ? "chatbox--active" : ""}`}>
          <div className="chatbox__header">
            <div className="chatbox__image--header">
              <img
                width="45"
                height="45"
                src="https://img.icons8.com/color/48/user.png"
                alt="chatbox-icon"
              />
            </div>
            <div className="chatbox__content--header">
              <h4 className="chatbox__heading--header">Chat support</h4>
              <p className="chatbox__description--header">
                Hi. My name is Sam. How can I help you?
              </p>
            </div>
          </div>

          <div className="chatbox__messages">
            {messages
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  className={`messages__item ${item.name === "Sam" ? "messages__item--visitor" : "messages__item--operator"}`}
                >
                  {item.message}
                </div>
              ))}
          </div>

          <div className="chatbox__footer">
            <input
              ref={inputRef}
              type="text"
              placeholder="Write a message..."
            />
            <button
              className="chatbox__send--footer send__button"
              onClick={onSendButton}
            >
              Send
            </button>
          </div>
        </div>

        {/* Only show the chatbox button if we're using internal state */}
        {toggleChat === undefined && (
          <div className="chatbox__button">
            <button
              onClick={toggleState}
              className="fixed bottom-5 right-5 z-50 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg transform transition duration-300 hover:scale-110"
            >
              💬
            </button>
          </div>
        )}
      </div>
      
      {/* Add the button if external toggle is provided */}
      {toggleChat !== undefined && (
        <button
          onClick={toggleState}
          className="fixed bottom-5 right-5 z-50 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg transform transition duration-300 hover:scale-110 cursor-pointer"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default Chatbox;