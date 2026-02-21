import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppConfig } from './hooks/useAppConfig';
import { ModeProvider, useMode } from './hooks/useMode';
import { Layout } from './components/Layout';
import { WidgetPair } from './components/WidgetPair';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConfigArea } from './components/ConfigArea';
import { InboxZero } from './components/widgets/InboxZero';
import { TasksToday } from './components/widgets/TasksToday';
import { ShoppingList } from './components/widgets/ShoppingList';
import { BTCPrice } from './components/widgets/BTCPrice';
import { StockPrice } from './components/widgets/StockPrice';
import { Tetris } from './components/widgets/Tetris';
import { Pomodoro } from './components/widgets/Pomodoro';
import type { Task, ShoppingItem } from './types';

const TASKS_KEY = 'daily-dashboard-tasks';
const SHOPPING_KEY = 'daily-dashboard-shopping';

function AppContent({ tasks, setTasks, shopping, setShopping }: {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  shopping: ShoppingItem[];
  setShopping: (items: ShoppingItem[] | ((prev: ShoppingItem[]) => ShoppingItem[])) => void;
}) {
  const mode = useMode();
  const { getWidgets, toggleWidget, moveWidget } = useAppConfig();
  const widgets = getWidgets();
  const enabledWidgets = widgets.filter(w => w.enabled);

  const renderWidget = (widgetId: string) => {
    const wrappedWidget = (() => {
      switch (widgetId) {
        case 'btc-price':
          return <BTCPrice />;
        case 'stock-price':
          return <StockPrice />;
        case 'tetris':
          return <Tetris />;
        case 'pomodoro':
          return <Pomodoro />;
        case 'inbox-zero':
          return <InboxZero setTasks={setTasks} />;
        case 'tasks-today':
          return <TasksToday tasks={tasks} setTasks={setTasks} />;
        case 'shopping-list':
          return <ShoppingList items={shopping} setItems={setShopping} />;
        default:
          return null;
      }
    })();

    if (!wrappedWidget) return null;

    return (
      <ErrorBoundary key={widgetId}>
        {wrappedWidget}
      </ErrorBoundary>
    );
  };

  const getVisibleWidgets = () => {
    if (mode === 'config') {
      return widgets;
    }
    return enabledWidgets;
  };

  const getPairWidgets = () => {
    const visible = getVisibleWidgets();
    const btcWidget = visible.find(w => w.id === 'btc-price');
    const stockWidget = visible.find(w => w.id === 'stock-price');
    return [btcWidget, stockWidget].filter(Boolean);
  };

  const getSingleWidgets = () => {
    const visible = getVisibleWidgets();
    const pairIds = ['btc-price', 'stock-price'];
    return visible.filter(w => !pairIds.includes(w.id));
  };

  const pairWidgets = getPairWidgets();
  const singleWidgets = getSingleWidgets();

  return (
    <Layout>
      <WidgetPair>
        {pairWidgets.map(w => w && renderWidget(w.id))}
      </WidgetPair>
      {singleWidgets.map(w => (
        <div key={w.id}>
          {renderWidget(w.id)}
        </div>
      ))}
      <ConfigArea
        widgets={widgets}
        onToggleWidget={toggleWidget}
        onMoveWidget={moveWidget}
      />
    </Layout>
  );
}

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);
  const [shopping, setShopping] = useLocalStorage<ShoppingItem[]>(SHOPPING_KEY, []);

  return (
    <ModeProvider>
      <AppContent
        tasks={tasks}
        setTasks={setTasks}
        shopping={shopping}
        setShopping={setShopping}
      />
    </ModeProvider>
  );
}

export default App;
