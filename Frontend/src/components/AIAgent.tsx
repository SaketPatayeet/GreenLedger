import React, { useState } from "react";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyBFSEsbk_DpSifE29Il14piCfRyLwfNdHI"; // Replace with your Gemini API key

export default function AIAgent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: input }]
            }
          ]
        }
      );
      const aiMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setMessages((prev) => [...prev, { role: "assistant", content: aiMessage }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Unable to get response." }]);
    }
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">AI Chat Agent (Gemini Flash)</h2>
      <div className="h-48 overflow-y-auto border mb-2 p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "text-blue-600" : "text-green-600"}>
              <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}