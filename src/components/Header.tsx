import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Trophy, Zap } from 'lucide-react';

export default function Header() {
  const { stats } = useAppContext();
  
  // Calculate progress to next level
  const pointsInCurrentLevel = stats.points % 100;
  const progressPercent = pointsInCurrentLevel; // Since each level is exactly 100 pts
  
  return (
    <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 pt-safe px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-2 rounded-xl">
            <Trophy className="text-indigo-400" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight shadow-indigo-500/20 drop-shadow-lg">LevelUp</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Lvl {stats.level}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
          <Zap className="text-amber-400 fill-amber-400/20" size={16} />
          <span className="font-bold font-mono text-sm tracking-tight">{stats.points} <span className="text-slate-500 text-xs">pts</span></span>
        </div>
      </div>
      
      {/* XP Bar */}
      <div className="mt-4 bg-slate-900 rounded-full h-1.5 w-full overflow-hidden relative shadow-inner">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </header>
  );
}
