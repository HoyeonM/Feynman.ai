import React, { useState, useRef } from 'react';

interface VideoContainerProps {
  className: string;
}

export const VideoContainer: React.FC<VideoContainerProps> = ({ className }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedData = () => {
    setIsVideoLoaded(true);
    // Start playing the video once it's loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error auto-playing video:", error);
      });
    }
  };

  return (
    <div className="flex flex-col h-[85%] bg-white -translate-y-7 rounded-xl shadow-lg overflow-hidden">
      <div className="flex-1 bg-gray-100 p-2 flex items-center justify-center">
        <div className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white relative">
          {!isVideoLoaded && (
            <p className="text-center absolute">Loading...</p>
          )}
          <video
            ref={videoRef}
            onLoadedData={handleLoadedData}
            className={`w-full h-full rounded-lg ${isVideoLoaded ? 'block' : 'hidden'}`}
            controls
            autoPlay
            playsInline
          >
            <source
              src={`/back/media/videos/output_manim_script/480p15/BasicAlgebra.mp4`}
              //src={`/back/media/videos/output_manim_script/480p15/${className}.mp4`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};
