import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { sender: "You", text: message }]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/dialogflow/chat",
        { message }
      );

      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: res.data.reply || "No response from bot." },
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "Bot", text: "Error connecting to chatbot." },
      ]);
    }

    setMessage("");
  };

  return (
    <>
      {/* Floating Circle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#16a34a", // TrustBus green
            color: "white",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "320px",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            🚌 TrustBus Assistant
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div
            style={{
              height: "220px",
              padding: "10px",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {chat.length === 0 && (
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                Ask me about bus timing, location, or safety.
              </p>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "You" ? "right" : "left",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    background:
                      msg.sender === "You" ? "#16a34a" : "#e5e7eb",
                    color: msg.sender === "You" ? "white" : "black",
                    fontSize: "13px",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: "none",
                padding: "10px",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                backgroundColor: "#16a34a", // green send button
                color: "white",
                border: "none",
                padding: "0 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
