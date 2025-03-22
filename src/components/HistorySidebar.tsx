
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Book, BookOpen, Calendar, Bookmark, Clock, Search, ChevronDown, Star, GraduationCap } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  type: 'class' | 'homework';
  subject: string;
  date: string;
  completed?: boolean;
  starred?: boolean;
}

export const HistorySidebar = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'classes' | 'homework'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('recent');
  
  // Sample history data
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      title: 'Introduction to Calculus',
      type: 'class',
      subject: 'Mathematics',
      date: '2023-09-15',
      completed: true,
      starred: true
    },
    {
      id: '2',
      title: 'Differentiation Practice',
      type: 'homework',
      subject: 'Mathematics',
      date: '2023-09-16',
      completed: true
    },
    {
      id: '3',
      title: 'Cell Biology Basics',
      type: 'class',
      subject: 'Biology',
      date: '2023-09-18',
      completed: true
    },
    {
      id: '4',
      title: 'Lab Report: Photosynthesis',
      type: 'homework',
      subject: 'Biology',
      date: '2023-09-19',
      completed: false
    },
    {
      id: '5',
      title: 'Newton\'s Laws of Motion',
      type: 'class',
      subject: 'Physics',
      date: '2023-09-21',
      completed: true,
      starred: true
    },
    {
      id: '6',
      title: 'Force and Acceleration Problems',
      type: 'homework',
      subject: 'Physics',
      date: '2023-09-22',
      completed: false
    },
    {
      id: '7',
      title: 'Shakespeare\'s Hamlet',
      type: 'class',
      subject: 'Literature',
      date: '2023-09-25',
      completed: true
    },
    {
      id: '8',
      title: 'Character Analysis Essay',
      type: 'homework',
      subject: 'Literature',
      date: '2023-09-26',
      completed: false
    }
  ];
  
  // Filter and sort items
  const filteredItems = historyItems
    .filter(item => {
      // Filter by type
      if (activeFilter === 'classes' && item.type !== 'class') return false;
      if (activeFilter === 'homework' && item.type !== 'homework') return false;
      
      // Filter by search query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.subject.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group by recent, this week, earlier
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  
  const recentItems = filteredItems.filter(
    item => new Date(item.date) >= oneWeekAgo
  );
  
  const earlierItems = filteredItems.filter(
    item => new Date(item.date) < oneWeekAgo
  );
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
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
          Learning History
        </h2>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search history..."
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
          onClick={() => setActiveFilter('classes')}
          className={cn(
            "flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors mx-1",
            activeFilter === 'classes' ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
          )}
        >
          Classes
        </button>
        <button
          onClick={() => setActiveFilter('homework')}
          className={cn(
            "flex-1 py-1 px-2 text-xs font-medium rounded-md transition-colors",
            activeFilter === 'homework' ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
          )}
        >
          Homework
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Recent Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleSection('recent')}
            className="flex items-center justify-between w-full p-3 hover:bg-sidebar-accent transition-colors"
          >
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span className="font-medium">Recent</span>
            </div>
            <ChevronDown 
              size={16} 
              className={cn(
                "transition-transform", 
                expandedSection === 'recent' ? "transform rotate-180" : ""
              )} 
            />
          </button>
          
          {expandedSection === 'recent' && (
            <div className="space-y-1 px-2 animate-fade-in">
              {recentItems.map(item => (
                <button
                  key={item.id}
                  className="flex items-center p-2 w-full text-left rounded-md hover:bg-sidebar-accent transition-colors"
                >
                  <div className="mr-2">
                    {getSubjectIcon(item.subject)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <span className="text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full mr-1">
                        {item.type === 'class' ? 'Class' : 'HW'}
                      </span>
                      {item.starred && <Star size={12} className="text-yellow-500" />}
                    </div>
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{item.subject}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {item.completed ? (
                    <div className="ml-2 h-2 w-2 rounded-full bg-green-500" title="Completed"></div>
                  ) : (
                    <div className="ml-2 h-2 w-2 rounded-full bg-yellow-500" title="In progress"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Earlier Section */}
        {earlierItems.length > 0 && (
          <div className="mb-2">
            <button
              onClick={() => toggleSection('earlier')}
              className="flex items-center justify-between w-full p-3 hover:bg-sidebar-accent transition-colors"
            >
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium">Earlier</span>
              </div>
              <ChevronDown 
                size={16} 
                className={cn(
                  "transition-transform", 
                  expandedSection === 'earlier' ? "transform rotate-180" : ""
                )} 
              />
            </button>
            
            {expandedSection === 'earlier' && (
              <div className="space-y-1 px-2 animate-fade-in">
                {earlierItems.map(item => (
                  <button
                    key={item.id}
                    className="flex items-center p-2 w-full text-left rounded-md hover:bg-sidebar-accent transition-colors"
                  >
                    <div className="mr-2">
                      {getSubjectIcon(item.subject)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="text-xs bg-sidebar-accent px-1.5 py-0.5 rounded-full mr-1">
                          {item.type === 'class' ? 'Class' : 'HW'}
                        </span>
                        {item.starred && <Star size={12} className="text-yellow-500" />}
                      </div>
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>{item.subject}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {item.completed ? (
                      <div className="ml-2 h-2 w-2 rounded-full bg-green-500" title="Completed"></div>
                    ) : (
                      <div className="ml-2 h-2 w-2 rounded-full bg-yellow-500" title="In progress"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
