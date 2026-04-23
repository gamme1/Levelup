import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Plus, CheckCircle2, Circle, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { Task, Frequency } from '../types';

export default function Tasks() {
  const { tasks, toggleTask, deleteTask, toggleSubtask } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Tasks</h1>
          <p className="text-slate-400 text-sm mt-1">{pending.length} remaining</p>
        </div>
        
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-full p-3 shadow-lg shadow-indigo-500/20 transition-transform active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      {showAdd && <AddTaskModal onClose={() => setShowAdd(false)} />}

      <div className="space-y-4">
        {pending.map(task => (
          <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} onToggleSubtask={(st) => toggleSubtask(task.id, st)} />
        ))}
        {pending.length === 0 && !showAdd && (
          <div className="text-center py-12 text-slate-500">
            <CheckCircle2 className="mx-auto mb-3 opacity-20" size={48} />
            <p>All tasks completed.</p>
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div className="pt-6 border-t border-slate-800">
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-500 mb-4">Completed</h2>
          <div className="space-y-3 opacity-60">
            {completed.map(task => (
              <TaskCard key={task.id} task={task} onToggle={() => toggleTask(task.id)} onDelete={() => deleteTask(task.id)} onToggleSubtask={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete, onToggleSubtask }: { key?: React.Key, task: Task, onToggle: () => void, onDelete: () => void, onToggleSubtask: (id:string) => void }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 flex gap-3">
        <button onClick={onToggle} className="mt-0.5 text-slate-400 hover:text-indigo-400 flex-shrink-0">
          {task.completed ? <CheckCircle2 className="text-indigo-500" size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1">
          <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
            <h3 className={cn("font-semibold", task.completed ? "text-slate-500 line-through" : "text-slate-200")}>{task.title}</h3>
            
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              {task.category && <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{task.category}</span>}
              {task.time && <span className="flex items-center gap-1"><Clock size={12}/> {task.time}</span>}
              {task.frequency !== 'once' && <span className="capitalize">{task.frequency}</span>}
            </div>
          </button>
        </div>
        
        <div className="flex mt-0.5 gap-2">
          {task.subtasks?.length > 0 && (
            <button onClick={() => setExpanded(!expanded)} className="text-slate-500">
               {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
          <button onClick={onDelete} className="text-slate-600 hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Expanded Subtasks area */}
      {expanded && task.subtasks?.length > 0 && (
        <div className="bg-slate-950/50 p-4 border-t border-slate-800 space-y-2">
          {task.subtasks.map(st => (
            <button 
               key={st.id} 
               onClick={() => onToggleSubtask(st.id)}
               className="flex items-center gap-3 w-full text-left p-2 rounded hover:bg-slate-800/50"
            >
               <div className={st.completed ? "text-indigo-500" : "text-slate-600"}>
                 {st.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
               </div>
               <span className={cn("text-sm", st.completed && "text-slate-500 line-through")}>{st.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddTaskModal({ onClose }: { onClose: () => void }) {
  const { addTask } = useAppContext();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [freq, setFreq] = useState<Frequency>('once');
  
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, category, frequency: freq, subtasks: [] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm space-y-4 animate-in zoom-in-95 duration-200">
        <h2 className="text-lg font-bold">New Task</h2>
        
        <input 
          autoFocus
          value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..." 
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500" 
        />
        
        <input 
          value={category} onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g. Work, Health)" 
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500" 
        />
        
        <div className="flex gap-2">
          {['once', 'daily', 'weekly'].map(f => (
            <button 
              key={f} type="button" onClick={() => setFreq(f as Frequency)}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors",
                freq === f ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-slate-950 border-slate-800 text-slate-400"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 p-3 rounded-xl font-medium text-slate-400 bg-slate-800 hover:bg-slate-700">Cancel</button>
          <button type="submit" disabled={!title.trim()} className="flex-1 p-3 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50">Create</button>
        </div>
      </form>
    </div>
  );
}
