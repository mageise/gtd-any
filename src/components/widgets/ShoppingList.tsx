/* eslint-disable react-hooks/purity */
import { useState, useRef, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import type { ShoppingItem } from '../../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

const QUICK_ADD_ITEMS = [
  'milk', 'eggs', 'bread', 'butter', 'cheese', 'cream cheese',
  'chicken', 'beef', 'pork', 'salami',
  'rice', 'pasta', 'noodles',
  'tomatoes', 'onions', 'carrots', 'cucumber', 'peppers', 'lettuce',
  'apples', 'bananas', 'grapes', 'oranges', 'berries',
  'yoghurt', 'ice cream',
  'coffee', 'tea', 'juice', 'water', 'soda',
  'Nutella', 'ketchup', 'dressing', 'egg salad',
  'pizza', 'desserts',
];

export function ShoppingList({ items, setItems }: ShoppingListProps) {
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const sortedItems = [...items].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev: ShoppingItem[]) => [newItem, ...prev]);
    setInput('');
  };

  const handleQuickAdd = (item: string) => {
    const now = Date.now();
    const newItem: ShoppingItem = {
      id: now.toString(),
      text: item,
      completed: false,
      createdAt: now,
    };
    setItems((prev: ShoppingItem[]) => [newItem, ...prev]);
  };

  const toggleItem = (id: string) => {
    setItems((prev: ShoppingItem[]) =>
      prev.map((i: ShoppingItem) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev: ShoppingItem[]) => prev.filter((i: ShoppingItem) => i.id !== id));
  };

  const startEditing = (item: ShoppingItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      setItems((prev: ShoppingItem[]) => 
        prev.map((i: ShoppingItem) => 
          i.id === editingId ? { ...i, text: editText.trim() } : i
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

  const clearAll = () => {
    setItems([]);
  };

  const completedCount = items.filter((i: ShoppingItem) => i.completed).length;
  const totalCount = items.length;

  return (
    <WidgetContainer title={`Shopping List (${completedCount}/${totalCount})`}>
      <div className="mb-3">
        <p className="text-xs text-[var(--color-text-secondary)] mb-2">Quick add:</p>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_ADD_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => handleQuickAdd(item)}
              className="px-2 py-1 text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded hover:bg-[var(--color-accent)] hover:text-white transition-colors capitalize"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add item..."
          className="w-full px-3 py-2 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)]"
        />
      </form>
      
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)] text-center py-4">
          No items. Quick add above or type to add!
        </p>
      ) : (
        <ul className="space-y-2 max-h-[200px] overflow-y-auto">
          {sortedItems.map((item: ShoppingItem) => (
            <li
              key={item.id}
              className={`flex items-center gap-2 p-2 bg-[var(--color-bg-tertiary)] rounded-lg ${
                item.completed ? 'opacity-50' : ''
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                  item.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                }`}
              >
                {item.completed && '✓'}
              </button>
              {editingId === item.id ? (
                <input
                  ref={editInputRef}
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
                  className={`flex-1 text-sm truncate cursor-pointer hover:text-[var(--color-accent)] ${
                    item.completed
                      ? 'line-through text-[var(--color-text-secondary)]'
                      : 'text-[var(--color-text-primary)]'
                  }`}
                >
                  {item.text}
                </span>
              )}
              <button
                onClick={() => deleteItem(item.id)}
                className="text-[var(--color-text-secondary)] hover:text-red-500 text-xs flex-shrink-0"
                title="Delete"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <footer>
        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </footer>
    </WidgetContainer>
  );
}
