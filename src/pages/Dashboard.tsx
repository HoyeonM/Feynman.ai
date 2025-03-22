import React, { useState } from 'react';
import { HistorySidebar } from '@/components/HistorySidebar';
import { Whiteboard } from '@/components/Whiteboard';
import { StickFigureAnimation } from '@/components/StickFigureAnimation';
import { ChatButton } from '@/components/ChatButton';
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
      
      {/* Search Input */}
      <div className="fixed top-4 right-4 z-[60] w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-md text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      
      {/* Chat Button */}
      <div className="fixed bottom-4 right-4 z-[60]">
        <ChatButton />
      </div>
    </div>
  );
};

export default Dashboard;
