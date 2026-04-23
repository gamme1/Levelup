import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Trophy, Timer, Play } from 'lucide-react';

const GAME_TIME = 60;

function generateProblem() {
  const operations = ['+', '-', '*'];
  const op = operations[Math.floor(Math.random() * operations.length)];
  let a, b, answer;
  
  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 1;
    b = Math.floor(Math.random() * 50) + 1;
    answer = a + b;
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 20;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 12) + 2;
    answer = a * b;
  }

  // Generate false choices
  const choices = new Set([answer]);
  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const fake = answer + offset;
    if (fake !== answer && fake >= 0) choices.add(fake);
  }
  
  return {
    question: `${a} ${op} ${b}`,
    answer,
    choices: Array.from(choices).sort(() => Math.random() - 0.5)
  };
}

export default function MathGame({ onComplete }: { onComplete: () => void }) {
  const { addGameScore } = useAppContext();
  
  const [playing, setPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [score, setScore] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(generateProblem());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playing && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && playing) {
      endGame();
    }
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setCurrentProblem(generateProblem());
    setFinished(false);
    setPlaying(true);
  };

  const endGame = () => {
    setPlaying(false);
    setFinished(true);
    // Score factor: 5 points per correct answer
    const finalScore = score * 5;
    addGameScore({ gameId: 'math', gameName: 'Math Sprint', score: finalScore });
  };

  const handleAnswer = (choice: number) => {
    if (choice === currentProblem.answer) {
      setScore(s => s + 1);
    }
    setCurrentProblem(generateProblem());
  };

  if (finished) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95">
        <Trophy className="text-orange-400 mb-6" size={64} />
        <h2 className="text-3xl font-black mb-2 text-white">Time's Up!</h2>
        <p className="text-slate-400 mb-8">You solved <span className="text-white font-bold">{score}</span> equations.</p>
        
        <div className="bg-orange-500/20 text-orange-400 p-6 rounded-2xl w-full mb-8 border border-orange-500/30">
          <p className="text-sm uppercase tracking-wider mb-1 font-bold">Earned Points</p>
          <p className="text-5xl font-black font-mono">+{score * 5}</p>
        </div>
        
        <div className="flex gap-4 w-full">
          <button onClick={onComplete} className="flex-1 p-4 rounded-xl font-bold bg-slate-800 text-white">Back</button>
          <button onClick={startGame} className="flex-1 p-4 rounded-xl font-bold bg-orange-500 text-orange-950">Play Again</button>
        </div>
      </div>
    );
  }

  if (!playing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-orange-500/20 p-6 rounded-full mb-8">
          <Timer className="text-orange-400" size={48} />
        </div>
        <h2 className="text-2xl font-black mb-4">Math Sprint</h2>
        <p className="text-slate-400 mb-10 max-w-[250px]">Solve as many basic math operations as you can in 60 seconds.</p>
        <button onClick={startGame} className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl font-black text-lg bg-orange-500 text-orange-950 hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20 active:scale-95">
          <Play fill="currentColor" /> Start Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between p-6 pb-20">
      <div className="flex justify-between items-center mb-8 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
         <div className="text-center">
           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Score</p>
           <p className="text-2xl font-black text-white font-mono">{score}</p>
         </div>
         <div className="text-center">
           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Time</p>
           <p className={`text-2xl font-black font-mono ${timeLeft < 10 ? 'text-red-400' : 'text-orange-400'}`}>{timeLeft}s</p>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <h3 className="text-6xl font-black tracking-tighter text-white font-mono">{currentProblem.question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentProblem.choices.map((choice, i) => (
          <button 
            key={i}
            onClick={() => handleAnswer(choice)}
            className="bg-slate-800 hover:bg-slate-700 active:bg-orange-500 text-white p-6 rounded-2xl text-3xl font-black font-mono transition-colors border border-slate-700"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
