import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { WidgetPair } from './components/WidgetPair';
import { InboxZero } from './components/widgets/InboxZero';
import { TodaysTasks } from './components/widgets/TodaysTasks';
import { ShoppingList } from './components/widgets/ShoppingList';
import { BTCPrice } from './components/widgets/BTCPrice';
import type { Task, ShoppingItem } from './types';

const TASKS_KEY = 'daily-dashboard-tasks';
const SHOPPING_KEY = 'daily-dashboard-shopping';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);
  const [shopping, setShopping] = useLocalStorage<ShoppingItem[]>(SHOPPING_KEY, []);

  return (
    <Layout>
      <WidgetPair>
        <BTCPrice />
      </WidgetPair>
      <InboxZero setTasks={setTasks} />
      <TodaysTasks tasks={tasks} setTasks={setTasks} />
      <ShoppingList items={shopping} setItems={setShopping} />
    </Layout>
  );
}

export default App;
