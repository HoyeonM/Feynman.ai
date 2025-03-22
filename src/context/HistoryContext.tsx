import React, { createContext, useContext, useState } from 'react';

interface HistoryItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  starred?: boolean;
  canvasData?: {
    lines: any[];
    position: { x: number; y: number };
    scale: number;
  };
}

interface HistoryContextType {
  historyItems: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setHistoryItems(prev => [newItem, ...prev]);
  };

  return (
    <HistoryContext.Provider value={{ historyItems, addHistoryItem }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}; 