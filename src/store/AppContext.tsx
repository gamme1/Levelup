import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { AppState, Task, Habit, GameScore, UserStats } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, getTodayStr } from '../lib/utils';

interface AppContextType extends AppState {
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (id: string) => void;
  
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'lastCompletedDate' | 'createdAt'>) => void;
  checkInHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  
  addGameScore: (score: Omit<GameScore, 'id' | 'playedAt'>) => void;
  
  addPoints: (points: number) => void;
  resetData: () => void;
}

const defaultStats: UserStats = {
  points: 0,
  level: 1,
  tasksCompleted: 0,
  habitsCompleted: 0,
};

const initialState: AppState = {
  tasks: [],
  habits: [],
  gameScores: [],
  stats: defaultStats,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useLocalStorage<AppState>('levelup_app_state', initialState);

  // Automatically roll over daily/weekly tasks
  useEffect(() => {
    const today = getTodayStr();
    
    setState(prev => {
      let changed = false;
      const updatedTasks = prev.tasks.map(task => {
        if (!task.completed || !task.completedAt) return task;
        
        const completedDate = task.completedAt.split('T')[0];
        if (task.frequency === 'daily' && completedDate !== today) {
          changed = true;
          return { ...task, completed: false, completedAt: undefined, subtasks: task.subtasks.map(st => ({...st, completed: false})) };
        }
        
        if (task.frequency === 'weekly') {
          const completedD = new Date(completedDate);
          const now = new Date(today);
          const diffTime = Math.abs(now.getTime() - completedD.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays >= 7) {
            changed = true;
            return { ...task, completed: false, completedAt: undefined, subtasks: task.subtasks.map(st => ({...st, completed: false})) };
          }
        }
        
        return task;
      });

      return changed ? { ...prev, tasks: updatedTasks } : prev;
    });
  }, [setState]);

  const addPoints = (points: number, statKey?: 'tasksCompleted' | 'habitsCompleted') => {
    setState(prev => {
      const newPoints = prev.stats.points + points;
      const newLevel = Math.floor(newPoints / 100) + 1;
      
      const updatedStats = {
        ...prev.stats,
        points: newPoints,
        level: newLevel,
      };
      
      if (statKey) {
        updatedStats[statKey] += 1;
      }
      
      return { ...prev, stats: updatedStats };
    });
  };

  // --- Tasks ---
  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: generateId(),
      completed: false,
      createdAt: getTodayStr(),
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleTask = (id: string) => {
    let earnedPoints = 0;
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === id) {
          const completed = !task.completed;
          if (completed && !task.completedAt) {
            earnedPoints = 10; // Award 10 points for completion
          }
          return { 
            ...task, 
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    }));
    if (earnedPoints > 0) {
      addPoints(earnedPoints, 'tasksCompleted');
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map(st => 
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return task;
      })
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  // --- Habits ---
  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'lastCompletedDate' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      streak: 0,
      createdAt: getTodayStr(),
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const checkInHabit = (id: string) => {
    const today = getTodayStr();
    let earnedPoints = 0;
    
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(habit => {
        if (habit.id === id) {
          if (habit.lastCompletedDate === today) return habit; // Already checked in
          
          earnedPoints = 5; // 5 pts for habit
          return {
            ...habit,
            streak: habit.streak + 1,
            lastCompletedDate: today,
          };
        }
        return habit;
      })
    }));
    
    if (earnedPoints > 0) {
      addPoints(earnedPoints, 'habitsCompleted');
    }
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  // --- Games ---
  const addGameScore = (scoreData: Omit<GameScore, 'id' | 'playedAt'>) => {
    const newScore: GameScore = {
      ...scoreData,
      id: generateId(),
      playedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, gameScores: [...prev.gameScores, newScore] }));
    addPoints(scoreData.score);
  };

  const resetData = () => {
    if (confirm('Are you sure you want to completely erase all progress?')) {
      setState(initialState);
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      addTask, toggleTask, toggleSubtask, deleteTask,
      addHabit, checkInHabit, deleteHabit,
      addGameScore, addPoints, resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
