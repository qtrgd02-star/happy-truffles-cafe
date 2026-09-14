"use client";

import { useState } from "react";
import { useWhatsApp } from "@/app/whatsapp-context";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, Phone } from "lucide-react";

export default function WhatsAppPage() {
  const { messages, sendMessage, clearMessages } = useWhatsApp();
  const [input, setInput] = useState("");
  const [phone, setPhone] = useState("+974");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(phone, input.trim());
    setInput("");
  };

  return (
    <div className="min-h-screen bg-vanilla/30 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-chocolate mb-2">WhatsApp Bot</h1>
          <p className="text-chocolate/70">Chat with our automated assistant</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-[#25D366] p-4 flex items-center gap-3">
            <MessageCircle className="text-white" size={28} />
            <div>
              <h2 className="text-white font-semibold">Happy Truffles Bot</h2>
              <p className="text-green-100 text-sm">Online</p>
            </div>
            <button onClick={clearMessages} className="ml-auto text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-vanilla/20">
            {messages.length === 0 && (
              <div className="text-center text-chocolate/60 py-12">
                <Phone className="mx-auto mb-3 text-chocolate/30" size={32} />
                <p>Start a conversation!</p>
                <p className="text-sm mt-1">Try: menu, hours, location, delivery</p>
              </div>
            )}
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.type === "outgoing" ? "bg-truffle text-white" : "bg-white border border-slate-200 text-chocolate"}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.type === "outgoing" ? "text-white/70" : "text-chocolate/50"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={16} className="text-chocolate/60" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-sm border border-chocolate/20 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-truffle"
                placeholder="+974 XXXX XXXX"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 border border-chocolate/20 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-truffle"
              />
              <button onClick={handleSend} className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#20bd5a] transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}