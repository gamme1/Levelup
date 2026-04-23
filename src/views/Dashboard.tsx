import React from 'react';
import { useAppContext } from '../store/AppContext';
import { getTodayStr } from '../lib/utils';
import { CheckCircle2, Circle, Flame, Target, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { tasks, habits, stats, toggleTask, checkInHabit } = useAppContext();
  const today = getTodayStr();

  const todayTasks = tasks.filter(t => !t.completed || t.completedAt?.startsWith(today));
  const pendingTasks = todayTasks.filter(t => !t.completed);
  
  const tasksPercent = todayTasks.length === 0 ? 0 : Math.round(((todayTasks.length - pendingTasks.length) / todayTasks.length) * 100);

  const habitsToComplete = habits.filter(h => h.lastCompletedDate !== today);
  const completedHabitsToday = habits.length - habitsToComplete.length;
  const habitsPercent = habits.length === 0 ? 0 : Math.round((completedHabitsToday / habits.length) * 100);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500">
      
      {/* Stats Summary */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-indigo-400">
            <Target size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black">{tasksPercent}%</span>
            <span className="text-sm text-slate-500 mb-1 pb-0.5">today</span>
          </div>
          <ProgressBar progress={tasksPercent} color="bg-indigo-500" />
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Flame size={18} />
            <span className="text-xs font-semibold uppercase tracking-wider">Habits</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black">{habitsPercent}%</span>
            <span className="text-sm text-slate-500 mb-1 pb-0.5">today</span>
          </div>
          <ProgressBar progress={habitsPercent} color="bg-emerald-500" />
        </div>
      </section>

      {/* Up Next - Tasks */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400">Pending Tasks</h2>
          <span className="text-xs text-slate-500">{pendingTasks.length} remaining</span>
        </div>
        
        {pendingTasks.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/50 border-dashed rounded-xl p-6 text-center text-slate-500">
            <CheckCircle2 className="mx-auto mb-2 opacity-20" size={32} />
            <p>All caught up for today!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTasks.slice(0, 3).map(task => (
              <button 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className="w-full text-left bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="text-slate-600"><Circle size={22} /></div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{task.title}</h3>
                    {task.category && <p className="text-xs text-slate-500 mt-0.5">{task.category}</p>}
                  </div>
                </div>
                <div className="bg-slate-800/50 text-slate-400 p-1.5 rounded-lg"><ChevronRight size={16} /></div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Up Next - Habits */}
      <section>
         <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-400">Daily Habits</h2>
          <span className="text-xs text-slate-500">{habitsToComplete.length} left</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {habits.slice(0,4).map(habit => {
            const isDone = habit.lastCompletedDate === today;
            return (
              <button
                key={habit.id}
                disabled={isDone}
                onClick={() => checkInHabit(habit.id)}
                className={cn(
                  "p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all",
                  isDone 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-60" 
                    : "bg-slate-900 border-slate-800 active:scale-[0.98]"
                )}
              >
                <h3 className="font-semibold text-sm line-clamp-2">{habit.title}</h3>
                <div className="flex items-center justify-between w-full mt-auto">
                  <span className="text-xs font-mono opacity-60 bg-black/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Flame size={10} /> {habit.streak}
                  </span>
                  {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-40" />}
                </div>
              </button>
            )
          })}
          {habits.length === 0 && (
             <div className="col-span-2 bg-slate-900/50 border border-slate-800/50 border-dashed rounded-xl p-6 text-center text-slate-500">
               <p>No habits tracked yet.</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProgressBar({ progress, color }: { progress: number, color: string }) {
  return (
    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
      <div 
        className={cn("h-full rounded-full transition-all duration-1000", color)} 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}
