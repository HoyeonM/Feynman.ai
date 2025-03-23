import React, { useState } from 'react';
import { VideoContainer } from '@/components/VideoContainer';
import { Navbar } from '@/components/Navbar2';
import LipSyncAnimation from '@/components/Animation';
import LipSyncAnimation from '@/components/Animation';
import { Chat } from '@/components/chat';

const Dashboard = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sentence = "HELLO WORLD";

  const handleFirstInteraction = () => {
    setHasInteracted(true);
  };

  return (
    <>
      <div className="flex flex-col bg-white overflow-hidden">
        {/*Navbar*/}
        <div><Navbar /></div>
      </div>

      <div className="flex min-h-screen relative">
        {/* Main Content */}
        <div className="flex-1 w-full relative">
          {hasInteracted && (
            <>
              <div className="flex w-full h-full">
                {/* Stick Figure Animation on the left */}
                <div className="w-[25%] lg:block flex-shrink-0">
                  <LipSyncAnimation sentence={sentence} interval={1000} />
                </div>
              
              {/* Video Container */}
              <div className="w-[70%] h-full ml-auto justify-end lg:p-2 lg:pl-2">
                <VideoContainer />
              </div>
              </div>
            </>
          )}
        </div>

        {/* Chat Input - Centered initially, moved to bottom after interaction */}
        <Chat onFirstInteraction={handleFirstInteraction} hasInteracted={hasInteracted} />
      </div>
    </>
  );
  
};

export default Dashboard;
