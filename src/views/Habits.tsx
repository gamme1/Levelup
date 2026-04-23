import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { getTodayStr } from '../lib/utils';
import { Plus, CheckCircle2, Flame, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Frequency } from '../types';

export default function Habits() {
  const { habits, checkInHabit, deleteHabit } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const today = getTodayStr();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
       <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Habits</h1>
          <p className="text-slate-400 text-sm mt-1">Consistency is key</p>
        </div>
        
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-full p-3 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {showAdd && <AddHabitModal onClose={() => setShowAdd(false)} />}

      <div className="grid gap-3">
        {habits.map(habit => {
          const isDone = habit.lastCompletedDate === today;
          return (
            <div key={habit.id} className="group relative">
               <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden md:block">
                  <button onClick={() => deleteHabit(habit.id)} className="text-red-400/50 hover:text-red-400 p-2"><Trash2 size={16}/></button>
               </div>
              <button
                disabled={isDone}
                onClick={() => checkInHabit(habit.id)}
                className={cn(
                  "w-full p-5 rounded-2xl border text-left flex items-center justify-between transition-all",
                  isDone 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-100" 
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 active:scale-[0.98]"
                )}
              >
                <div>
                  <h3 className={cn("font-bold text-lg mb-1", isDone ? "text-emerald-300" : "text-white")}>{habit.title}</h3>
                  <div className="flex gap-2">
                    <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-400 flex items-center gap-1.5 w-fit">
                      <Flame size={12} className={habit.streak > 2 ? "text-orange-500" : "text-slate-500"}/> 
                      {habit.streak} / Day Streak
                    </span>
                  </div>
                </div>

                <div className={cn(
                   "p-3 rounded-full border-2",
                   isDone ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "border-slate-700 text-slate-700"
                )}>
                  <CheckCircle2 size={24} className={isDone ? "opacity-100" : "opacity-0"} />
                </div>
              </button>
              <button onClick={() => deleteHabit(habit.id)} className="absolute bottom-2 right-4 text-xs text-red-500/50 md:hidden p-2"><Trash2 size={14}/></button>
            </div>
          )
        })}

        {habits.length === 0 && !showAdd && (
          <div className="text-center py-16 text-slate-500">
             <Flame className="mx-auto mb-4 opacity-20" size={48} />
             <p className="text-lg mb-2 text-slate-300">No habits tracked</p>
             <p className="text-sm">Start building a routine today.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AddHabitModal({ onClose }: { onClose: () => void }) {
  const { addHabit } = useAppContext();
  const [title, setTitle] = useState('');
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHabit({ title, frequency: 'daily' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm space-y-5 animate-in zoom-in-95 duration-200">
        <h2 className="text-lg font-bold">New Habit</h2>
        
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Habit Name</label>
          <input 
            autoFocus
            value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read 10 pages, Drink Water..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500" 
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 p-3 rounded-xl font-medium text-slate-400 bg-slate-800 hover:bg-slate-700">Cancel</button>
          <button type="submit" disabled={!title.trim()} className="flex-1 p-3 rounded-xl font-bold text-emerald-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50">Save</button>
        </div>
      </form>
    </div>
  );
}
