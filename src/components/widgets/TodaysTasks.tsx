import { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Task } from '../../types';

const TASKS_KEY = 'daily-dashboard-tasks';

export function TodaysTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev: Task[]) => [newTask, ...prev]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev: Task[]) =>
      prev.map((t: Task) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev: Task[]) => prev.filter((t: Task) => t.id !== id));
  };

  const completedCount = tasks.filter((t: Task) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <WidgetContainer title={`Today's Tasks (${completedCount}/${totalCount})`}>
      <form onSubmit={handleAdd} className="mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)]"
        />
      </form>
      
      {tasks.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
          No tasks yet. Add one above or graduate from inbox!
        </p>
      ) : (
        <ul className="space-y-2 max-h-[250px] overflow-y-auto">
          {tasks.map((task: Task) => (
            <li
              key={task.id}
              className={`flex items-center gap-3 p-2 bg-[var(--color-bg-tertiary)] rounded-lg group transition-opacity ${
                task.completed ? 'opacity-50' : ''
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                }`}
              >
                {task.completed && '✓'}
              </button>
              <span
                className={`flex-1 text-sm truncate transition-all ${
                  task.completed
                    ? 'line-through text-[var(--color-text-secondary)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-all"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </WidgetContainer>
  );
}
