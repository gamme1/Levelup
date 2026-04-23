import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Trophy, Play, BrainCircuit } from 'lucide-react';
import { cn } from '../../lib/utils';

const ICONS = ['🥑', '🍕', '🚀', '🎸', '🎮', '💡', '🔥', '💎'];

type Card = { id: number; content: string; matched: boolean };

export default function MemoryGame({ onComplete }: { onComplete: () => void }) {
  const { addGameScore } = useAppContext();
  
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [moves, setMoves] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  const initGame = () => {
    // Duplicate icons, shuffle
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((content, id) => ({ id, content, matched: false }));
      
    setCards(deck);
    setFlippedIndex([]);
    setMoves(0);
    setStartTime(Date.now());
    setFinished(false);
    setPlaying(true);
  };

  const handleCardClick = (index: number) => {
    if (!playing || flippedIndex.length === 2 || flippedIndex.includes(index) || cards[index].matched) {
      return;
    }

    const newFlipped = [...flippedIndex, index];
    setFlippedIndex(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].content === cards[second].content) {
        // Match!
        setTimeout(() => {
          setCards(prev => {
            const next = [...prev];
            next[first].matched = true;
            next[second].matched = true;
            
            // Check win condition
            if (next.every(c => c.matched)) {
              handleWin();
            }
            return next;
          });
          setFlippedIndex([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndex([]);
        }, 800);
      }
    }
  };

  const handleWin = () => {
    setPlaying(false);
    setFinished(true);
    
    // Time taken in seconds
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    setFinalTime(timeTaken);
    
    // Score calculation
    // Base 200, minus 2 pts per second, minus 5 pts per move. Min 10 points.
    let baseScore = 200 - (timeTaken * 2) - (moves * 3);
    if (baseScore < 10) baseScore = 10;
    
    addGameScore({ gameId: 'memory', gameName: 'Memory Match', score: baseScore });
  };

  if (finished) {
    // Points formula recalc for display consistency
    let baseScore = 200 - (finalTime * 2) - (moves * 3);
    if (baseScore < 10) baseScore = 10;

    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
        <Trophy className="text-indigo-400 mb-6" size={64} />
        <h2 className="text-3xl font-black mb-2 text-white">Board Cleared!</h2>
        
        <div className="flex gap-4 justify-center mb-8 w-full mt-4">
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex-1">
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Time</p>
             <p className="text-2xl font-mono font-bold text-white">{finalTime}s</p>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex-1">
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Moves</p>
             <p className="text-2xl font-mono font-bold text-white">{moves}</p>
           </div>
        </div>
        
        <div className="bg-indigo-500/20 text-indigo-400 p-6 rounded-2xl w-full mb-8 border border-indigo-500/30">
          <p className="text-sm uppercase tracking-wider mb-1 font-bold">Earned Points</p>
          <p className="text-5xl font-black font-mono">+{baseScore}</p>
        </div>
        
        <div className="flex gap-4 w-full">
          <button onClick={onComplete} className="flex-1 p-4 rounded-xl font-bold bg-slate-800 text-white">Back</button>
          <button onClick={initGame} className="flex-1 p-4 rounded-xl font-bold bg-indigo-500 text-indigo-950">Play Again</button>
        </div>
      </div>
    );
  }

  if (!playing && !finished) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-indigo-500/20 p-6 rounded-full mb-8">
          <BrainCircuit className="text-indigo-400" size={48} />
        </div>
        <h2 className="text-2xl font-black mb-4">Memory Match</h2>
        <p className="text-slate-400 mb-10 max-w-[250px]">Find all the matching pairs. Be quick and use fewer moves to earn more points!</p>
        <button onClick={initGame} className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl font-black text-lg bg-indigo-500 text-indigo-950 hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/20 active:scale-95">
          <Play fill="currentColor" /> Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 pb-20">
      <div className="flex justify-between items-center mb-10 bg-slate-900 border border-slate-800 p-4 rounded-2xl font-mono text-sm uppercase tracking-widest font-bold">
         <span className="text-slate-400">Moves: <span className="text-white text-lg">{moves}</span></span>
         <span className="text-indigo-400">Match Them All!</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3 w-full max-w-[320px] mx-auto perspective-1000">
          {cards.map((card, idx) => {
            const isFlipped = flippedIndex.includes(idx) || card.matched;
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className="relative aspect-square w-full rounded-xl transform-style-3d transition-transform duration-300"
                style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
              >
                {/* Back (Hidden state) */}
                <div className="absolute inset-0 bg-slate-800 border-2 border-slate-700 rounded-xl backface-hidden" />
                
                {/* Front (Icon state) */}
                <div className={cn(
                  "absolute inset-0 rounded-xl flex items-center justify-center text-3xl sm:text-4xl backface-hidden rotate-y-180 border-2",
                  card.matched ? "bg-indigo-950/50 border-indigo-500/30 opacity-60" : "bg-slate-700 border-slate-600 shadow-inner"
                )}>
                  {card.content}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
