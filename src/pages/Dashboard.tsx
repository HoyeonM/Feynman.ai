import React, { useState, useEffect } from 'react';
import { VideoContainer } from '@/components/VideoContainer';
import { Navbar } from '@/components/Navbar2';
import LipSyncAnimation from '@/components/Animation';
import { Chat } from '@/components/chat';

const Dashboard = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [videoClassName, setVideoClassName] = useState<string | null>(null);
  const sentence = "HELLO WORLD";

  const handleFirstInteraction = () => {
    setHasInteracted(true);
  };

  const handleVideoGenerated = (className: string) => {
    console.log(`Dashboard received video class name: ${className}`);
    setVideoClassName(className);
  };

  // For debugging
  useEffect(() => {
    console.log(`Current video class name: ${videoClassName}`);
  }, [videoClassName]);

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
                  {videoClassName ? (
                    <VideoContainer className={videoClassName} />
                  ) : (
                    <div className="flex items-center justify-center h-[80%] bg-black rounded-xl">
                      <p className="text-white">
                        Loading...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chat Input - Centered initially, moved to bottom after interaction */}
        <Chat 
          onFirstInteraction={handleFirstInteraction} 
          hasInteracted={hasInteracted}
          onVideoGenerated={handleVideoGenerated}
        />
      </div>
    </>
  );
};

export default Dashboard;
