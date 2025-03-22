import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Send, Bot, Sparkles } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export const AiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI learning assistant. How can I help with your studies today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI typing
    setIsTyping(true);

    // Simulate AI response delay (0.8 to the 1.8s)
    setTimeout(() => {
      const aiResponses = [
        "I understand your question. Let me explain this concept in more detail.",
        "That's a great question! Here's what I can tell you about that topic.",
        "I can help you solve this problem. First, let's break it down into steps.",
        "Let me check some resources and provide you with a comprehensive answer.",
        "I'd be happy to help with your homework. Let's work through it together.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 800);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between border-b">
        <div className="flex items-center">
          <Bot size={20} className="mr-2" />
          <h3 className="font-medium">AI Learning Assistant</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Sparkles size={16} />
          <span className="text-xs font-medium">Powered by AI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-3 rounded-lg",
                message.sender === "user"
                  ? "bg-primary/10 ml-auto max-w-[80%]"
                  : "bg-secondary/50 mr-auto max-w-[80%]"
              )}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p>{message.content}</p>
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="p-3 rounded-lg bg-secondary/50 mr-auto">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <div
                  className="w-2 h-2 rounded-full bg-current animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-current animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-secondary p-3 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground p-3 rounded-r-md hover:bg-primary/90 transition-colors"
            disabled={!inputValue.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
