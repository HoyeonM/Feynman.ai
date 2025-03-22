import React from 'react';

export const VideoContainer = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-3 bg-secondary flex items-center justify-between border-b">
        {/* <h2 className="text-lg font-semibold">Genesis</h2> */}
      </div>
      
      <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center">
        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white">
          <p className="text-center">Video or Animation Container</p>
          {/* Animation or video component would go here */}
        </div>
      </div>
    </div>
  );
}; 