import { useLocalStorage } from './hooks/useLocalStorage';
import { Layout } from './components/Layout';
import { WidgetPair } from './components/WidgetPair';
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
      <WidgetPair>
        <DailyQuote size="half" />
        <Finance size="half" />
      </WidgetPair>
      <InboxZero setTasks={setTasks} />
      <TodaysTasks tasks={tasks} setTasks={setTasks} />
      <TimeBlocks />
    </Layout>
  );
}

export default App;
