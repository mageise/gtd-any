import { useState, useRef, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import type { InboxItem, Task } from '../../types';

const INBOX_KEY = 'daily-dashboard-inbox';

interface InboxZeroProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function InboxZero({ setTasks }: InboxZeroProps) {
  const [inbox, setInbox] = useState<InboxItem[]>(() => {
    const stored = localStorage.getItem(INBOX_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const saveInbox = (items: InboxItem[]) => {
    setInbox(items);
    localStorage.setItem(INBOX_KEY, JSON.stringify(items));
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newItem: InboxItem = {
      id: Date.now().toString(),
      text: input.trim(),
      createdAt: Date.now(),
    };
    saveInbox([newItem, ...inbox]);
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
    saveInbox(inbox.filter((i: InboxItem) => i.id !== item.id));
  };

  const handleDelete = (id: string) => {
    saveInbox(inbox.filter((i: InboxItem) => i.id !== id));
  };

  const startEditing = (item: InboxItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      saveInbox(inbox.map((i: InboxItem) => 
        i.id === editingId ? { ...i, text: editText.trim() } : i
      ));
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
              className="flex items-center gap-2 p-2 bg-[var(--color-bg-tertiary)] rounded-lg"
            >
              {editingId === item.id ? (
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
                  onClick={() => startEditing(item)}
                  className="flex-1 text-sm text-[var(--color-text-primary)] truncate cursor-pointer hover:text-[var(--color-accent)]"
                >
                  {item.text}
                </span>
              )}
              <button
                onClick={() => handleGraduate(item)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] text-xs"
                title="Move to tasks"
              >
                →
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-[var(--color-text-secondary)] hover:text-red-500 text-xs"
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
