
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, CircleStop, MoveUp } from 'lucide-react';

interface ChatProps {
  onFirstInteraction?: () => void;
  hasInteracted?: boolean;
}

export const Chat: React.FC<ChatProps> = ({ onFirstInteraction, hasInteracted = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // To track recording duration
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<any>(null); // To store interval ID for recording time

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // If recording is ongoing, ignore submit
    if (isRecording) return;

    if (!inputValue.trim()) return;

    // Trigger the first interaction if it hasn't happened yet
    if (!hasInteracted && onFirstInteraction) {
      onFirstInteraction();
    }

    console.log('Text message:', inputValue);
    setInputValue("");

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

  const handleRecording = async () => {
    try {
      // Trigger the first interaction if starting recording and it hasn't happened yet
      if (!isRecording && !hasInteracted && onFirstInteraction) {
        onFirstInteraction();
      }

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

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('voice', audioBlob);

          // Send audio blob to backend
          fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            body: formData,
          }).then(() => {
            console.log("Voice message sent");
          }).catch(error => {
            console.error('Error sending voice message:', error);
          });

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
          placeholder={isRecording ? "" : hasInteracted ? "Type your message..." : "Ask Feynman.ai anything..."}
          className="w-[95%] px-4 py-3 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          name="userInput"
          autoComplete="off"
          style={{ paddingRight: "6rem" }} // space for both buttons
        />

        {/* Voice Button */}
        <Button
          type="button"
          variant="ghost"
          className="absolute right-16 top-1/2 -translate-y-1/2 p-0 hover:bg-transparent"
          onClick={handleRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? <CircleStop size={40} /> : <Mic size={30} />}
        </Button>

        {/* Recording bar */}
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: '#855FEE',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#D6C2FF')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#855FEE')}
        >
          <MoveUp size={20} />
        </Button>
      </form>
    </div>
  );
};
