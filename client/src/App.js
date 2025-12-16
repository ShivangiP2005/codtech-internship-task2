import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("history", (data) => {
      setMessages(data);
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", {
        user: username,
        text: message
      });
      setMessage("");
    }
  };

  if (!joined) {
    return (
      <div className="join-container">
        <h2>Enter Username</h2>
        <input
          placeholder="Your name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={() => setJoined(true)}>Join Chat</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h2>CODTECH Real-Time Chat</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
