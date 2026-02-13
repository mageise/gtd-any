import { useState, useRef, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import type { Task } from '../../types';

interface TodaysTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  size?: 'quarter' | 'half' | 'full' | 'tall';
}

export function TodaysTasks({ tasks, setTasks, size = 'full' }: TodaysTasksProps) {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

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

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      setTasks((prev: Task[]) => 
        prev.map((t: Task) => 
          t.id === editingId ? { ...t, text: editText.trim() } : t
        )
      );
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const completedCount = tasks.filter((t: Task) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <WidgetContainer title={`Today's Tasks (${completedCount}/${totalCount})`} size={size}>
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
              className={`flex items-center gap-2 p-2 bg-[var(--color-bg-tertiary)] rounded-lg ${
                task.completed ? 'opacity-50' : ''
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  task.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                }`}
              >
                {task.completed && '✓'}
              </button>
              {editingId === task.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-2 py-1 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded text-sm outline-none"
                />
              ) : (
                <span 
                  onClick={() => startEditing(task)}
                  className={`flex-1 text-sm truncate cursor-pointer hover:text-[var(--color-accent)] ${
                    task.completed
                      ? 'line-through text-[var(--color-text-secondary)]'
                      : 'text-[var(--color-text-primary)]'
                  }`}
                >
                  {task.text}
                </span>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-[var(--color-text-secondary)] hover:text-red-500 text-xs flex-shrink-0"
                title="Delete"
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
