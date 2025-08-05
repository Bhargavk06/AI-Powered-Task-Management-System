// src/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';

function ChatWindow({ onToggle, onSendMessage }) {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "gemini" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

  // Scroll to the latest message whenever messages array changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input.trim(), sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]); // Add user message immediately
      setInput(''); // Clear input

      try {
        // Call the onSendMessage prop (which is EmployeeTodo's chatBot function)
        const geminiReply = await onSendMessage(userMessage.text);
        setMessages((prevMessages) => [...prevMessages, { text: geminiReply, sender: "gemini" }]);
      } catch (error) {
        console.error("Error sending message to Gemini:", error);
        setMessages((prevMessages) => [...prevMessages, { text: "Oops! Something went wrong. Please try again.", sender: "gemini" }]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div id="chat-application-container" className="chat-container">
      <div className="chat-header">
        <h3>Gemini Chat</h3>
        <span className="close-btn" onClick={onToggle}>X</span>
      </div>
      <div className="chat-messages" id="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}-message`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Element to scroll into view */}
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          id="user-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button id="send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;