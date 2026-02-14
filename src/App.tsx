import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { WidgetPair } from './components/WidgetPair';
import { InboxZero } from './components/widgets/InboxZero';
import { TodaysTasks } from './components/widgets/TodaysTasks';
import { BTCPrice } from './components/widgets/BTCPrice';
import type { Task } from './types';

const TASKS_KEY = 'daily-dashboard-tasks';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);

  return (
    <Layout>
      <WidgetPair>
        <BTCPrice />
      </WidgetPair>
      <InboxZero setTasks={setTasks} />
      <TodaysTasks tasks={tasks} setTasks={setTasks} />
    </Layout>
  );
}

export default App;
