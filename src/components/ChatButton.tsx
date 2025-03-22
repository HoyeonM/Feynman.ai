
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AiChat } from '@/components/AiChat';

export const ChatButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg w-14 h-14 p-0 flex items-center justify-center"
          aria-label="Open AI Chat"
        >
          <MessageCircle size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 h-[600px]">
        <AiChat />
      </DialogContent>
    </Dialog>
  );
};
