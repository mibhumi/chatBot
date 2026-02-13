import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input;
    const userMessage = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch('/api/chat', { // update end point as needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();
      const botText = data?.response ?? 'Sorry, no response.';

      const botMessage = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errMessage = { sender: 'bot', text: 'Error: could not reach server.' };
      setMessages((prev) => [...prev, errMessage]);
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Smart ChatBot</h1>

      <div className="chatArea">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="inputArea">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input"
        />
        <button onClick={handleSend} className="button">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
