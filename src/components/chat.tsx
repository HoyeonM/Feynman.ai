import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, CircleStop, MoveUp } from 'lucide-react';

interface ChatProps {
  onFirstInteraction?: () => void;
  hasInteracted?: boolean;
  onVideoGenerated?: (className: string, inputType?: 'text' | 'audio') => void;
}

export const Chat: React.FC<ChatProps> = ({ 
  onFirstInteraction, 
  hasInteracted = false,
  onVideoGenerated 
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // To track recording duration
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<any>(null); // To store interval ID for recording time

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // If recording is ongoing or processing, ignore submit
    if (isRecording || isProcessing) return;

    if (!inputValue.trim()) return;

    // Trigger the first interaction if it hasn't happened yet
    if (!hasInteracted && onFirstInteraction) {
      onFirstInteraction();
    }

    console.log('Text message:', inputValue);
    setInputValue("");
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:8000/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate video');
      }

      const data = await response.json();
      console.log('Response from server:', data);
      
      if (data && data.className) {
        console.log('Video generated with class name:', data.className);
        onVideoGenerated(data.className, 'text');
      } else {
        console.error('Missing className in server response:', data);
        // If we don't have a class name but have code, try to extract it from the response
        if (data && data.manim_code) {
          // Simple regex to extract class name from code
          const classNameMatch = data.manim_code.match(/class\s+(\w+)\s*\(/);
          if (classNameMatch && classNameMatch[1]) {
            const extractedClassName = classNameMatch[1];
            console.log('Extracted class name from code:', extractedClassName);
            onVideoGenerated(extractedClassName, 'text');
          } else {
            throw new Error('Could not extract class name from code');
          }
        } else {
          throw new Error('Response does not contain className or manim_code');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecording = async () => {
    try {
      if (!isRecording) {
        console.log("Starting recording...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        setRecordingTime(0); // Reset recording timer

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          console.log("Recording stopped");
          setIsProcessing(true);

          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('voice', audioBlob);

            // Send audio blob to backend
            const response = await fetch('http://localhost:8000/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.detail || 'Failed to process audio');
            }

            const data = await response.json();
            console.log('Response from server:', data);
            
            if (data && data.className) {
              console.log('Video generated with class name:', data.className);
              onVideoGenerated(data.className, 'audio');
            } else {
              console.error('Missing className in server response:', data);
              // If we don't have a class name but have code, try to extract it from the response
              if (data && data.manim_code) {
                // Simple regex to extract class name from code
                const classNameMatch = data.manim_code.match(/class\s+(\w+)\s*\(/);
                if (classNameMatch && classNameMatch[1]) {
                  const extractedClassName = classNameMatch[1];
                  console.log('Extracted class name from code:', extractedClassName);
                  onVideoGenerated(extractedClassName, 'audio');
                } else {
                  throw new Error('Could not extract class name from code');
                }
              } else {
                throw new Error('Response does not contain className or manim_code');
              }
            }
          } catch (error) {
            console.error('Error sending voice message:', error);
          } finally {
            setIsProcessing(false);
          }

          // Trigger the first interaction after recording stops
          if (!hasInteracted && onFirstInteraction) {
            onFirstInteraction();
          }

          // Stop all audio tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        // Start the timer
        intervalRef.current = setInterval(() => {
          setRecordingTime(prevTime => prevTime + 1); // Increment time
        }, 1000); // Update every second
      } else {
        console.log("Stopping recording...");
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
        clearInterval(intervalRef.current); // Stop the timer
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsProcessing(false);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Calculate width of the recording bar based on time
  const maxRecordingTime = 8; // Maximum time in seconds (e.g., 10 seconds)
  const maxWidth = 90; // Max width of the bar in percentage
  const width = Math.min((recordingTime / maxRecordingTime) * maxWidth, maxWidth);

  return (
    <div className={`${hasInteracted 
      ? "fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4" 
      : "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4"}`}>
      <form onSubmit={handleSendMessage} className="w-full relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isProcessing 
              ? "Processing your request..." 
              : isRecording 
                ? "" 
                : hasInteracted 
                  ? "Type your message..." 
                  : "Ask Feynman.ai anything..."
          }
          disabled={isProcessing || isRecording}
          className={`w-full px-4 py-3 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm ${isProcessing ? 'opacity-70' : 'opacity-100'}`}
          name="userInput"
          autoComplete="off"
          style={{ paddingRight: "6rem" }} // space for both buttons
        />

        {/* Voice Button */}
        <Button
          type="button"
          variant="ghost"
          className="absolute right-16 top-1/2 -translate-y-1/2 p-0 hover:bg-transparent z-10"
          onClick={handleRecording}
          disabled={isProcessing}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <CircleStop size={40} /> : <Mic size={30} />}
        </Button>

        {/* Recording bar or processing indicator */}
        {isRecording && (
          <div
            className="absolute bottom-2 text-sm left-5 w-full h-1 bg-primary/20"
            style={{
              width: `${width}%`,
              transition: 'width 6s linear', // Smooth transition for width change
              backgroundColor: '#855FEE',
            }}
          >
            <div
              className="right-2 absolute text-sm text-gray-500 opacity-80 bottom-1.5 left-1/2 transform -translate-x-1/2"
              style={{ width: '100%' }}
            >
              {recordingTime}s
            </div>
          </div>
        )}
        
        {/* {isProcessing && (
          <div className="absolute bottom-2 text-sm left-5 w-full flex justify-center">
            <div className="text-gray-500">
              Processing...
            </div>
          </div>
        )} */}

        {/* Submit Button */}
        <Button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
          style={{
            backgroundColor: '#855FEE',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D6C2FF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#855FEE';
          }}
        >
          <MoveUp size={20} />
        </Button>
      </form>
    </div>
  );
};
