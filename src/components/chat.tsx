import React, { useState } from 'react';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
}

export const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      timestamp: new Date(),
    };

    try {
      // Send message to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Add message to local state
      setMessages(prev => [...prev, userMessage]);
      
      // Clear input
      setInputValue("");
    } catch (error) {
      console.error('Error sending message:', error);
      // You might want to show an error toast here
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      <form onSubmit={handleSendMessage} className="w-full">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-4 py-3 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          name="userInput"
        />
      </form>
    </div>
  );
};
