import React from 'react';

export const Chat = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      <input 
        type="text"
        placeholder="Type your message..."
        className="w-full px-4 py-3 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
        name="userInput"
      />
    </div>
  );
};
