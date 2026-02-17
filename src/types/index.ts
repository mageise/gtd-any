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
  previousPrice?: number;
  lastUpdated: number | null;
}

export interface StockData {
  ticker: string;
  stockPrice: number;
  previousPrice?: number;
  lastUpdated: number | null;
  companyName?: string;
  currency?: string;
}

export interface StockList {
  stocks: StockData[];
  activeIndex: number;
}

export interface AppState {
  timeBlocks: TimeBlock[];
  inbox: InboxItem[];
  tasks: Task[];
  finance: FinanceData;
  quote: Quote | null;
}
