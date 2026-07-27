import React from 'react';
import { Sun, Moon, RefreshCw, Layers, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onSyncTrigger: () => void;
  isSyncing: boolean;
  syncTime: Date | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onSyncTrigger, isSyncing, syncTime }) => {
  const { setTheme, isDark } = useTheme();

  const getSyncText = () => {
    if (isSyncing) return 'Syncing...';
    if (!syncTime) return 'Never synced';
    const seconds = Math.floor((new Date().getTime() - syncTime.getTime()) / 1000);
    if (seconds < 10) return 'Synced just now';
    if (seconds < 60) return `Synced ${seconds}s ago`;
    return `Synced at ${syncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-border bg-surface text-text-primary z-10 shrink-0">
      {/* Workspace Indicator */}
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-brand" />
        <span className="font-display font-medium text-sm text-text-secondary">Workspace /</span>
        <span className="font-display font-semibold text-sm text-text-primary">Enterprise Operations</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Sync Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs font-medium text-text-secondary">
          <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse text-brand' : 'text-text-secondary'}`} />
          <span>{getSyncText()}</span>
        </div>

        {/* Sync Action Button */}
        <button
          onClick={onSyncTrigger}
          disabled={isSyncing}
          className="p-2 rounded-md border border-border hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 rounded-md border border-border hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary"
        >
          {isDark ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-md">
            EX
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-text-primary leading-none">Executive User</p>
            <p className="text-[10px] text-text-secondary leading-none mt-1">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
