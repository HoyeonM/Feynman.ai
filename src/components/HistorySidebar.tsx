import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Star, GraduationCap } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  starred?: boolean;
}

export const HistorySidebar = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // history items
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      title: 'English',
      subject: 'Mathematics',
      date: '2024-01-01',
      starred: true
    },
    {
      id: '2',
      title: 'Maths',
      subject: 'Mathematics',
      date: '2024-01-01',
    }
  ];

  // Filter items
  const filteredItems = historyItems
    .filter(item => {
      // Filter by starred if selected
      if (activeFilter === 'starred' && !item.starred) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get the icon for a subject
  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics':
        return <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-md">M</div>;
      case 'biology':
        return <div className="w-6 h-6 flex items-center justify-center bg-green-100 text-green-600 rounded-md">B</div>;
      case 'physics':
        return <div className="w-6 h-6 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-md">P</div>;
      case 'literature':
        return <div className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded-md">L</div>;
      default:
        return <div className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded-md">?</div>;
    }
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-sidebar text-sidebar-foreground border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <GraduationCap className="mr-2" />
          Previous Chats
        </h2>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-sidebar-accent text-sidebar-accent-foreground rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex border-b p-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={cn(
            "flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors",
            activeFilter === 'all' ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('starred')}
          className={cn(
            "flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors mx-1",
            activeFilter === 'starred' ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
          )}
        >
          Starred
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              className="flex items-center p-2 w-full text-left rounded-md hover:bg-sidebar-accent transition-colors"
            >
              <div className="mr-2">
                {getSubjectIcon(item.subject)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {item.starred && <Star size={12} className="text-yellow-500 mr-1" />}
                  <p className="truncate text-sm font-medium">{item.title}</p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{item.subject}</span>
                  <span className="mx-1">•</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
