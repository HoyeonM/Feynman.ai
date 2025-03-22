import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, CircleStop, MoveUp } from 'lucide-react';

export const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    // If recording is ongoing, ignore submit
    if (isRecording) return;

    if (!inputValue.trim()) return;

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
      if (!isRecording) {
        console.log("Starting recording...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

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
      } else {
        console.log("Stopping recording...");
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4">
      <form onSubmit={handleSendMessage} className="w-full">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
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
          {isRecording ? <CircleStop size={20} /> : <Mic size={20} />}
        </Button>

        {/* Submit Button */}
        <Button
          type="submit"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
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
