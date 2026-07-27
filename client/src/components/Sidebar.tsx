import { useState } from 'react';
import { LayoutDashboard, BarChart3, Settings, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '72px' : '240px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex flex-col h-full min-h-0 border-r border-border bg-surface text-text-primary z-20 shrink-0 overflow-hidden"
    >
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-border gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-brand text-white shadow-brand-glow">
          <Briefcase className="w-5 h-5" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display font-bold text-lg tracking-wide text-brand"
          >
            Skylar BI
          </motion.span>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center w-full px-3 py-2.5 rounded-md transition-all relative ${
                isActive
                  ? 'bg-surface-hover text-brand font-medium border-l-2 border-brand'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <Icon className="w-5 h-5 min-w-[20px]" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 font-sans text-sm"
                >
                  {item.name}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Trigger Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-6 -right-3 flex items-center justify-center w-6 h-6 rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover shadow-md z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};
