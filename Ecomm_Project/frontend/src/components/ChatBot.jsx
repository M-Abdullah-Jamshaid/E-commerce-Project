import React, { useState, useRef, useEffect } from "react";
import { showError } from "./ToastNotification";
import API_URL from "../config";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Chat State
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi there! I'm your AI Shopping Assistant. Looking for headphones, watches, or specific specs? Ask me!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  // 3. Send Logic
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;

    // Add User Message to UI
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      // --- FIX FOR BACKEND ERROR ---
      // Gemini requires history to start with 'user'.
      // We filter out the first AI greeting message.
      const chatHistory = messages
        .slice(1) // Skip the first message (the "Hi" greeting)
        .map((m) => ({
          role: m.sender === "ai" ? "model" : "user",
          parts: [{ text: m.text }],
        }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: chatHistory, // Send the filtered history
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Server Error");

      // Add AI Response to UI
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      showError("AI is sleeping.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ I'm having trouble connecting. Try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .chat-widget { position: fixed; bottom: 30px; right: 30px; z-index: 9999; font-family: 'Montserrat', sans-serif; }
        .chat-toggle { width: 60px; height: 60px; border-radius: 50%; background: #ff8c00; color: white; border: none; box-shadow: 0 4px 15px rgba(255, 140, 0, 0.4); cursor: pointer; font-size: 1.8rem; display: grid; place-items: center; transition: transform 0.3s; }
        .chat-toggle:hover { transform: scale(1.1); background: #e67e00; }
        
        /* Desktop Window */
        .chat-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: #1a1a1a; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; border: 1px solid #333; animation: slideUp 0.3s ease-out; transform-origin: bottom right; }
        
        @keyframes slideUp { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        
        .chat-header { background: #222; padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; color: white; }
        .chat-title { font-weight: 700; display: flex; align-items: center; gap: 10px; font-size: 1rem; }
        .online-dot { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 10px #00ff88; }
        .chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; background: #111; scrollbar-width: thin; scrollbar-color: #333 #111; }
        .message { max-width: 85%; padding: 12px 16px; border-radius: 15px; font-size: 0.9rem; line-height: 1.5; word-wrap: break-word; }
        .msg-ai { align-self: flex-start; background: #2a2a2a; color: #e0e0e0; border-bottom-left-radius: 2px; border: 1px solid #333; }
        .msg-user { align-self: flex-end; background: #ff8c00; color: white; border-bottom-right-radius: 2px; box-shadow: 0 4px 10px rgba(255, 140, 0, 0.2); }
        .typing { font-style: italic; color: #666; font-size: 0.8rem; margin-left: 10px; display: flex; gap: 5px; }
        .dot { width: 5px; height: 5px; background: #666; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        .chat-footer { padding: 15px; background: #222; border-top: 1px solid #333; }
        .chat-form { display: flex; gap: 10px; }
        .chat-input { flex: 1; background: #111; border: 1px solid #333; padding: 12px 15px; border-radius: 25px; color: white; outline: none; font-family: 'Montserrat', sans-serif; transition: 0.3s; }
        .chat-input:focus { border-color: #ff8c00; }
        .send-btn { background: #ff8c00; color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: grid; place-items: center; transition: 0.3s; font-size: 1.2rem; }
        .send-btn:hover { background: #e67e00; transform: scale(1.05); }
        .send-btn:disabled { background: #444; cursor: not-allowed; transform: none; }
        
        /* --- MOBILE CENTER FIX --- */
        @media (max-width: 480px) { 
          .chat-window { 
            position: fixed; /* Fix to viewport */
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%) !important; /* Force Center */
            bottom: auto; 
            right: auto;
            width: 90%; 
            height: 70vh; 
            box-shadow: 0 0 0 1000px rgba(0,0,0,0.7); /* Dark Overlay */
            animation: mobileFade 0.3s ease-out; /* Simple fade to avoid transform conflict */
          } 
          .chat-widget { bottom: 20px; right: 20px; } 
        }
        @keyframes mobileFade { from { opacity: 0; } to { opacity: 1; } }
      `,
        }}
      />

      <div className="chat-widget">
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-title">
                <div className="online-dot"></div> AI Assistant
              </div>
              <i
                className="ri-close-line"
                style={{ cursor: "pointer", fontSize: "1.5rem", color: "#888" }}
                onClick={() => setIsOpen(false)}
              ></i>
            </div>
            <div className="chat-body">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.sender === "ai" ? "msg-ai" : "msg-user"}`}
                >
                  {msg.text.split("\n").map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
              ))}
              {loading && (
                <div className="typing">
                  <span>AI is thinking</span>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-footer">
              <form className="chat-form" onSubmit={handleSend}>
                <input
                  className="chat-input"
                  placeholder="Ask about products..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <button className="send-btn" disabled={loading}>
                  <i className="ri-send-plane-2-fill"></i>
                </button>
              </form>
            </div>
          </div>
        )}
        <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <i className="ri-arrow-down-s-line"></i>
          ) : (
            <i className="ri-robot-2-fill"></i>
          )}
        </button>
      </div>
    </>
  );
}
