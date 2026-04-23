import React, { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { Home, CheckSquare, Activity, Brain } from 'lucide-react';
import Dashboard from './views/Dashboard';
import Tasks from './views/Tasks';
import Habits from './views/Habits';
import GamesView from './views/Games/GamesView';
import Header from './components/Header';
import { cn } from './lib/utils';

type Tab = 'dashboard' | 'tasks' | 'habits' | 'games';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans md:max-w-md md:mx-auto md:border-x md:border-slate-800 md:shadow-2xl">
      <Header />
      
      <main className="flex-1 overflow-y-auto pb-20 pt-4 px-4 scrollbar-hide">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'tasks' && <Tasks />}
        {currentTab === 'habits' && <Habits />}
        {currentTab === 'games' && <GamesView />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 pb-safe md:max-w-md">
        <div className="flex justify-around items-center h-16">
          <NavItem icon={<Home />} label="Hub" tab="dashboard" currentTab={currentTab} onClick={() => setCurrentTab('dashboard')} />
          <NavItem icon={<CheckSquare />} label="Tasks" tab="tasks" currentTab={currentTab} onClick={() => setCurrentTab('tasks')} />
          <NavItem icon={<Activity />} label="Habits" tab="habits" currentTab={currentTab} onClick={() => setCurrentTab('habits')} />
          <NavItem icon={<Brain />} label="Games" tab="games" currentTab={currentTab} onClick={() => setCurrentTab('games')} />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ icon, label, tab, currentTab, onClick }: { icon: React.ReactNode; label: string; tab: Tab; currentTab: Tab; onClick: () => void }) {
  const isActive = currentTab === tab;
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
        isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-400"
      )}
    >
      <div className={cn("transition-transform duration-200", isActive && "scale-110")}>
        {React.cloneElement(icon as React.ReactElement, { size: 22 })}
      </div>
      <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
