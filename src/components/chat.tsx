import React, { useState } from 'react';

export const Chat = () => {
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Print message to console
    console.log('Message:', inputValue);
    
    // Clear input immediately
    setInputValue("");

    // Send message to backend (fire and forget)
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: inputValue }),
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      {/* Input form */}
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
