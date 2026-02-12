import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { DailyQuote } from './components/widgets/DailyQuote';
import { TimeBlocks } from './components/widgets/TimeBlocks';
import { InboxZero } from './components/widgets/InboxZero';
import { TodaysTasks } from './components/widgets/TodaysTasks';
import { Finance } from './components/widgets/Finance';
import type { Task } from './types';

const TASKS_KEY = 'daily-dashboard-tasks';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);

  return (
    <Layout>
      <DailyQuote />
      <InboxZero setTasks={setTasks} />
      <TodaysTasks tasks={tasks} setTasks={setTasks} />
      <TimeBlocks />
      <Finance />
    </Layout>
  );
}

export default App;
