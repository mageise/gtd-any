export interface Quote {
  text: string;
  author: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  duration: number; // in minutes
  remaining: number; // in seconds
  isRunning: boolean;
}

export interface InboxItem {
  id: string;
  text: string;
  createdAt: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface ShoppingItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface FinanceData {
  btcPrice: number;
  lastUpdated: number | null;
}

export interface AppState {
  timeBlocks: TimeBlock[];
  inbox: InboxItem[];
  tasks: Task[];
  finance: FinanceData;
  quote: Quote | null;
}
