export type Frequency = 'once' | 'daily' | 'weekly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  time?: string;
  frequency: Frequency;
  subtasks: Subtask[];
  completed: boolean;
  createdAt: string; 
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: Frequency;
  streak: number;
  lastCompletedDate?: string;
  createdAt: string;
}

export interface GameScore {
  id: string;
  gameId: string;
  gameName: string;
  score: number;
  playedAt: string;
}

export interface UserStats {
  points: number;
  level: number;
  tasksCompleted: number;
  habitsCompleted: number;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  gameScores: GameScore[];
  stats: UserStats;
}
