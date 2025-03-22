import React, { useState } from 'react';
import { HistorySidebar } from '@/components/HistorySidebar';
import { Whiteboard } from '@/components/Whiteboard';
import { StickFigureAnimation } from '@/components/StickFigureAnimation';
import { Chat } from '@/components/chat';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 lg:hidden z-[60] p-2 rounded-md bg-primary text-primary-foreground shadow-md"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* History Sidebar */}
      <div 
        className={cn(
          "fixed lg:relative h-full w-[220px] transition-all duration-300 ease-in-out z-50",
          sidebarOpen ? "left-0" : "-left-[220px] lg:left-0"
        )}
      >
        <HistorySidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 w-full relative">
        {/* Main dashboard container with Whiteboard */}
        <div className="w-full h-full min-h-screen p-4 lg:p-6 lg:pl-4">
          <div className="w-full h-full">
            <Whiteboard />
          </div>
        </div>
        
        {/* Stick Figure Animation */}
        <div className="hidden lg:block fixed bottom-8 left-[230px] z-40">
          <StickFigureAnimation />
        </div>
      </div>
      
      {/* Chat Input */}
      <Chat />
    </div>
  );
};

export default Dashboard;
