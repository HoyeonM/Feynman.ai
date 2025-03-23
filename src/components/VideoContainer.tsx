import React, { useState, useRef, useEffect } from 'react';
import LipSyncAnimation from './Animation';

interface VideoContainerProps {
  className: string;
  inputType?: 'text' | 'audio'; // Optional prop to specify input type
}

export const VideoContainer: React.FC<VideoContainerProps> = ({ 
  className,
  inputType 
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Define possible paths based on input type or try both
  const textPath = `/back/media/videos/output_manim_script/480p15/${className}.mp4`;
  const audioPath = `/back/media/videos/output_manim_script_from_audio/480p15/${className}.mp4`;

  useEffect(() => {
    // Reset video loading state when className changes
    setIsVideoLoaded(false);
    setVideoError(false);
    
    // Determine which path to try first
    if (inputType === 'audio') {
      setCurrentPath(audioPath);
    } else if (inputType === 'text') {
      setCurrentPath(textPath);
    } else {
      // If no input type specified, start with text path
      setCurrentPath(textPath);
    }
    
    console.log(`Loading video for class: ${className}`);
  }, [className, inputType, textPath, audioPath]);

  const handleLoadedData = () => {
    setIsVideoLoaded(true);
    setVideoError(false);
    console.log(`Video loaded successfully for class: ${className} from path: ${currentPath}`);
    // Start playing the video once it's loaded
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error auto-playing video:", error);
      });
      setIsVideoPlaying(true);
    }
  };

  const handleError = () => {
    // If the current path is the text path and no input type was specified, try the audio path
    if (currentPath === textPath && !inputType) {
      console.log(`Error loading from text path, trying audio path for: ${className}`);
      setCurrentPath(audioPath);
      return;
    }
    
    // If we've already tried both paths or have a specific input type, show error
    setVideoError(true);
    console.error(`Error loading video for class: ${className} from path: ${currentPath}`);
  };

  // Monitor video playing state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => setIsVideoPlaying(false);
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, [videoRef.current]);

  return (
    <div className="flex flex-col h-[85%] bg-white -translate-y-7 rounded-xl shadow-lg overflow-hidden">
      <div className="flex-1 bg-gray-100 p-2 flex items-center justify-center" style={{ height: '100%' }}>
        <div 
          className="w-full bg-black rounded-lg flex items-center justify-center text-white relative overflow-hidden" 
          style={{ 
            aspectRatio: '16/9', 
            height: '100%',
            maxHeight: '100%'
          }}
        >
          {/* Video Element - Always render with a placeholder while loading */}
          <div className="w-full h-full" style={{ position: 'absolute', inset: 0 }}>
            {currentPath && (
              <div className={`w-full h-full ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                <video
                  ref={videoRef}
                  onLoadedData={handleLoadedData}
                  onError={handleError}
                  className="w-full h-full rounded-lg"
                  controls
                  autoPlay
                  playsInline
                  key={currentPath}
                  style={{ display: 'block', objectFit: 'contain' }}
                >
                  <source
                    src={currentPath}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
          
          {/* Loading and Error Messages */}
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ pointerEvents: 'none' }}>
            {!isVideoLoaded && !videoError && (
              <div className="text-center">
                <p>Loading...</p>
              </div>
            )}
            {videoError && (
              <div className="text-center">
                <p className="text-red-500 mb-2">Error loading video. Please try again.</p>
                <p className="text-sm text-gray-400">Could not load video from any known path.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
