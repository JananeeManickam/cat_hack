import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import '../styles/Chatbot.css';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    // Simulate bot reply (replace with real logic)
    setTimeout(() => {
      setMessages(msgs => [
        ...msgs,
        { text: "Sorry, I'm just a demo chatbot.", sender: "bot" }
      ]);
    }, 500);
  };

  return (
    <div className="cat-chatbot-container">
      <div className="cat-chatbot-header">
        <h2>CATerpillar Chatbot</h2>
      </div>
      <div className="cat-chatbot-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === "user" ? "cat-chatbot-msg user" : "cat-chatbot-msg bot"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="cat-chatbot-input-row">
        <input
          type="text"
          className="cat-chatbot-input"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button className="cat-chatbot-send-btn" onClick={handleSend}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}