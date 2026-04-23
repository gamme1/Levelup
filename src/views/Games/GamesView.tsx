import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Brain, Calculator, ChevronRight, X } from 'lucide-react';
import MathGame from './MathGame';
import MemoryGame from './MemoryGame';

type GameFocus = 'menu' | 'math' | 'memory';

export default function GamesView() {
  const { gameScores } = useAppContext();
  const [activeGame, setActiveGame] = useState<GameFocus>('menu');

  if (activeGame === 'math') {
    return <GameWrapper title="Math Sprint" onClose={() => setActiveGame('menu')}><MathGame onComplete={() => setActiveGame('menu')} /></GameWrapper>;
  }

  if (activeGame === 'memory') {
    return <GameWrapper title="Memory Match" onClose={() => setActiveGame('menu')}><MemoryGame onComplete={() => setActiveGame('menu')} /></GameWrapper>;
  }

  // Get high scores
  const maxMath = Math.max(0, ...gameScores.filter(s => s.gameId === 'math').map(s => s.score));
  const maxMemory = Math.max(0, ...gameScores.filter(s => s.gameId === 'memory').map(s => s.score));

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white mb-2">Mind Games</h1>
        <p className="text-slate-400 text-sm">Train your brain and earn points</p>
      </div>

      <div className="grid gap-4">
        {/* Memory Game Card */}
        <button 
          onClick={() => setActiveGame('memory')}
          className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-5 rounded-2xl text-left hover:border-indigo-500/60 transition-colors active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-4">
             <div className="bg-indigo-500/20 p-3 rounded-xl"><Brain className="text-indigo-400" size={24} /></div>
             <ChevronRight className="text-slate-500" />
          </div>
          <h3 className="font-bold text-lg text-white">Memory Match</h3>
          <p className="text-slate-400 text-sm mt-1 mb-4">Test your spatial memory. Find all matching pairs as fast as you can.</p>
          <div className="text-xs font-mono text-indigo-300 bg-indigo-950/50 px-2 py-1 rounded inline-block">Best: {maxMemory} pts</div>
        </button>

        {/* Math Game Card */}
        <button 
          onClick={() => setActiveGame('math')}
          className="bg-gradient-to-br from-orange-900/50 to-slate-900 border border-orange-500/30 p-5 rounded-2xl text-left hover:border-orange-500/60 transition-colors active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-4">
             <div className="bg-orange-500/20 p-3 rounded-xl"><Calculator className="text-orange-400" size={24} /></div>
             <ChevronRight className="text-slate-500" />
          </div>
          <h3 className="font-bold text-lg text-white">Math Sprint</h3>
          <p className="text-slate-400 text-sm mt-1 mb-4">Solve as many simple equations as possible in 60 seconds.</p>
          <div className="text-xs font-mono text-orange-300 bg-orange-950/50 px-2 py-1 rounded inline-block">Best: {maxMath} pts</div>
        </button>
      </div>
      
      {/* Recent History */}
      <div className="pt-6 border-t border-slate-800">
         <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500 mb-4">Recent Plays</h2>
         {gameScores.length === 0 ? (
           <p className="text-slate-600 text-sm italic">Play a game to see your history.</p>
         ) : (
           <div className="space-y-2">
             {[...gameScores].reverse().slice(0, 5).map(score => (
                <div key={score.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                  <div className="flex gap-2 items-center">
                    {score.gameId === 'math' ? <Calculator size={16} className="text-orange-400/70" /> : <Brain size={16} className="text-indigo-400/70" />}
                    <span className="text-sm font-medium text-slate-300">{score.gameName}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-white">+{score.score} pts</span>
                </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}

function GameWrapper({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:max-w-md md:mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 pt-safe">
        <h2 className="font-bold text-lg">{title}</h2>
        <button onClick={onClose} className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
