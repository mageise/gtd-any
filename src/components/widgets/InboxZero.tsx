import { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { InboxItem, Task } from '../../types';

const INBOX_KEY = 'daily-dashboard-inbox';
const TASKS_KEY = 'daily-dashboard-tasks';

interface InboxZeroProps {
  onGraduate?: () => void;
}

export function InboxZero({ onGraduate }: InboxZeroProps) {
  const [inbox, setInbox] = useLocalStorage<InboxItem[]>(INBOX_KEY, []);
  const [, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newItem: InboxItem = {
      id: Date.now().toString(),
      text: input.trim(),
      createdAt: Date.now(),
    };
    setInbox((prev: InboxItem[]) => [newItem, ...prev]);
    setInput('');
  };

  const handleGraduate = (item: InboxItem) => {
    const newTask: Task = {
      id: item.id,
      text: item.text,
      completed: false,
      createdAt: item.createdAt,
    };
    setTasks((prev: Task[]) => [newTask, ...prev]);
    setInbox((prev: InboxItem[]) => prev.filter((i: InboxItem) => i.id !== item.id));
    onGraduate?.();
  };

  const handleDelete = (id: string) => {
    setInbox((prev: InboxItem[]) => prev.filter((i: InboxItem) => i.id !== id));
  };

  return (
    <WidgetContainer title="Inbox Zero">
      <form onSubmit={handleAdd} className="mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Capture thought..."
          className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)]"
        />
      </form>
      
      {inbox.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
          Inbox zero! 🎯
        </p>
      ) : (
        <ul className="space-y-2 max-h-[200px] overflow-y-auto">
          {inbox.map((item: InboxItem) => (
            <li
              key={item.id}
              className="flex items-center gap-2 p-2 bg-[var(--color-bg-tertiary)] rounded-lg group"
            >
              <span className="flex-1 text-sm text-[var(--color-text-primary)] truncate">
                {item.text}
              </span>
              <button
                onClick={() => handleGraduate(item)}
                className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30 transition-all"
              >
                → Task
              </button>
              <button
                onClick={() => handleDelete(item.id)}
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
