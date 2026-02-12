import { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { DailyQuote } from './components/widgets/DailyQuote';
import { TimeBlocks } from './components/widgets/TimeBlocks';
import { InboxZero } from './components/widgets/InboxZero';
import { TodaysTasks } from './components/widgets/TodaysTasks';
import { Finance } from './components/widgets/Finance';

function App() {
  const [tasksKey, setTasksKey] = useState(0);

  const handleGraduate = useCallback(() => {
    setTasksKey((prev) => prev + 1);
  }, []);

  return (
    <Layout>
      <DailyQuote />
      <TimeBlocks />
      <InboxZero onGraduate={handleGraduate} />
      <TodaysTasks key={tasksKey} />
      <Finance />
    </Layout>
  );
}

export default App;
