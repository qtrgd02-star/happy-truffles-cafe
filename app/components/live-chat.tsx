"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to Happy Truffles Cafe. How can I help you today?",
      sender: "support",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our team will get back to you shortly. For immediate assistance, please call us at +974 3159 0002.",
        sender: "support",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-truffle text-white p-4 rounded-full shadow-lg hover:bg-chocolate transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-chocolate/10">
            <div>
              <h3 className="font-semibold text-chocolate">Happy Truffles Cafe</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-chocolate/60 hover:text-chocolate">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-truffle text-white rounded-br-none"
                    : "bg-vanilla/60 text-chocolate rounded-bl-none"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-chocolate/50"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-vanilla/60 rounded-2xl rounded-bl-none px-4 py-2">
                  <p className="text-sm text-chocolate/60">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-chocolate/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border border-chocolate/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-truffle"
              />
              <button onClick={sendMessage} className="bg-truffle text-white p-2 rounded-full hover:bg-chocolate transition-colors">
                <Send size={18} />
              </button>
            </div>
            <a
              href="https://wa.me/97431590002"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-2 text-sm text-[#25D366] hover:underline"
            >
              <Phone size={14} />
              Or chat on WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </>
  );
}
