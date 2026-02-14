import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { WidgetPair } from './components/WidgetPair';
import { ErrorBoundary } from './components/ErrorBoundary';
import { InboxZero } from './components/widgets/InboxZero';
import { TasksToday } from './components/widgets/TasksToday';
import { ShoppingList } from './components/widgets/ShoppingList';
import { BTCPrice } from './components/widgets/BTCPrice';
import { StockPrice } from './components/widgets/StockPrice';
import type { Task, ShoppingItem } from './types';

const TASKS_KEY = 'daily-dashboard-tasks';
const SHOPPING_KEY = 'daily-dashboard-shopping';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);
  const [shopping, setShopping] = useLocalStorage<ShoppingItem[]>(SHOPPING_KEY, []);

  return (
    <Layout>
      <WidgetPair>
        <ErrorBoundary>
          <BTCPrice />
        </ErrorBoundary>
        <ErrorBoundary>
          <StockPrice />
        </ErrorBoundary>
      </WidgetPair>
      <ErrorBoundary>
        <InboxZero setTasks={setTasks} />
      </ErrorBoundary>
      <ErrorBoundary>
        <TasksToday tasks={tasks} setTasks={setTasks} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ShoppingList items={shopping} setItems={setShopping} />
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
