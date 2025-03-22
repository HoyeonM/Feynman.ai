
import React, { useState } from 'react';
import { HistorySidebar } from '@/components/HistorySidebar';
import { Whiteboard } from '@/components/Whiteboard';
import { AiChat } from '@/components/AiChat';
import { StickFigureAnimation } from '@/components/StickFigureAnimation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 lg:hidden z-50 p-2 rounded-md bg-primary text-primary-foreground shadow-md"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* History Sidebar - Reduced width */}
      <div 
        className={cn(
          "fixed lg:relative lg:flex h-full w-full max-w-[220px] transition-all duration-300 ease-in-out z-40",
          sidebarOpen ? "left-0" : "-left-[220px] lg:left-0"
        )}
      >
        <HistorySidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 w-full overflow-hidden">
        {/* Stick Figure Animation (positioned at bottom left) */}
        <div className="hidden lg:flex fixed bottom-8 left-[230px] z-30">
          <StickFigureAnimation />
        </div>
        
        {/* Main dashboard container with Whiteboard and AI Chat */}
        <div className="flex flex-col lg:flex-row w-full h-full min-h-screen p-4 lg:p-6 lg:pl-4">
          {/* Whiteboard section - Increased size */}
          <div className="w-full lg:w-3/4 lg:h-full mb-4 lg:mb-0 lg:mr-4">
            <Whiteboard />
          </div>
          
          {/* AI Chat section - Decreased size */}
          <div className="w-full lg:w-1/4 lg:h-full">
            <AiChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
