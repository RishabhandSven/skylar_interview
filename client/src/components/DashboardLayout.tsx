import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: (currentTab: string, onSyncTrigger: () => void, isSyncing: boolean, syncTime: Date | null) => React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState<Date | null>(new Date());

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTime(new Date());
    }, 1500); // simulate API synchronization
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-background text-text-primary">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Navbar 
          onSyncTrigger={handleSync} 
          isSyncing={isSyncing} 
          syncTime={syncTime} 
        />
        
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children(currentTab, handleSync, isSyncing, syncTime)}
        </main>
      </div>
    </div>
  );
};
