/* eslint-disable react-hooks/purity */
import { useState, useRef, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import type { ShoppingItem } from '../../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

type CategoryKey = 'dairy' | 'meat' | 'carbs' | 'produce' | 'fruit' | 'drinks' | 'other' | 'ready';

interface QuickAddCategory {
  label: string;
  color: string;
  items: string[];
}

const QUICK_ADD_CATEGORIES: Record<CategoryKey, QuickAddCategory> = {
  dairy: { label: 'Dairy', color: 'bg-blue-500', items: ['Milk', 'Eggs', 'Butter', 'Cheese', 'Cream cheese', 'Yoghurt', 'Ice cream'] },
  meat: { label: 'Meat', color: 'bg-red-700', items: ['Chicken', 'Beef', 'Pork', 'Salami'] },
  carbs: { label: 'Carbs', color: 'bg-amber-500', items: ['Rice', 'Pasta', 'Noodles', 'Bread'] },
  produce: { label: 'Produce', color: 'bg-green-500', items: ['Tomatoes', 'Onions', 'Carrots', 'Cucumber', 'Peppers', 'Lettuce'] },
  fruit: { label: 'Fruit', color: 'bg-purple-500', items: ['Apples', 'Bananas', 'Grapes', 'Oranges', 'Berries'] },
  drinks: { label: 'Drinks', color: 'bg-cyan-500', items: ['Coffee', 'Tea', 'Juice', 'Water', 'Soda'] },
  other: { label: 'Other', color: 'bg-orange-500', items: ['Nutella', 'Ketchup', 'Dressing', 'Egg salad'] },
  ready: { label: 'Ready', color: 'bg-pink-500', items: ['Pizza', 'Desserts'] },
};

const CATEGORY_ORDER: CategoryKey[] = ['dairy', 'meat', 'carbs', 'produce', 'fruit', 'drinks', 'other', 'ready'];

export function ShoppingList({ items, setItems }: ShoppingListProps) {
  const [input, setInput] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);
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

  const displayItems = pendingToggle
    ? sortedItems.map(item => 
        item.id === pendingToggle 
          ? { ...item, completed: !item.completed } 
          : item
      )
    : sortedItems;

  const handleToggleComplete = (id: string) => {
    setPendingToggle(id);
    setTimeout(() => {
      setItems((prev: ShoppingItem[]) =>
        prev.map((i: ShoppingItem) => (i.id === id ? { ...i, completed: !i.completed } : i))
      );
      setPendingToggle(null);
    }, 300);
  };

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

  const handleQuickAdd = (itemName: string) => {
    const now = Date.now();
    const nameLower = itemName.toLowerCase();
    
    setItems((prev: ShoppingItem[]) => {
      const existingItem = prev.find((i: ShoppingItem) => {
        const textLower = i.text.toLowerCase();
        return textLower === nameLower || textLower.endsWith(' ' + nameLower);
      });
      
      if (existingItem) {
        const match = existingItem.text.match(/^(\d+)x (.+)$/);
        if (match) {
          const quantity = parseInt(match[1], 10);
          const name = match[2];
          return prev.map((i: ShoppingItem) => 
            i.id === existingItem.id ? { ...i, text: `${quantity + 1}x ${name}` } : i
          );
        } else {
          return prev.map((i: ShoppingItem) => 
            i.id === existingItem.id ? { ...i, text: `2x ${itemName}` } : i
          );
        }
      }
      
      const newItem: ShoppingItem = {
        id: now.toString(),
        text: itemName,
        completed: false,
        createdAt: now,
      };
      return [newItem, ...prev];
    });
  };

  const toggleItem = (id: string) => {
    handleToggleComplete(id);
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
    <WidgetContainer 
      title="Shopping List"
      footer={
        <div className="flex justify-between items-center w-full">
          {items.length === 0 ? (
            <span className="text-xs text-[var(--color-text-secondary)]">No items. Add one above or use quick add!</span>
          ) : (
            <>
              <span className="text-xs text-[var(--color-text-secondary)]">{completedCount}/{totalCount} item{totalCount !== 1 ? 's' : ''} bought</span>
              <button
                onClick={clearAll}
                className="text-xs text-[var(--color-text-secondary)] hover:text-rose-500 transition-colors"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      }
    >
      <form onSubmit={handleAdd} className={`${items.length > 0 || showQuickAdd ? 'mb-2' : ''} relative`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add item..."
          className="w-full px-3 py-2 pr-8 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded-lg text-base outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)]"
        />
        <button
          type="button"
          onClick={() => setShowQuickAdd(!showQuickAdd)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm px-1"
        >
          {showQuickAdd ? '▲' : '▼'}
        </button>
      </form>

      {showQuickAdd && (
        <div className={`${items.length > 0 ? 'mb-2' : ''}`}>
          {CATEGORY_ORDER.map((categoryKey) => {
            const category = QUICK_ADD_CATEGORIES[categoryKey];
            return (
              <div key={categoryKey} className="mb-2 last:mb-0">
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleQuickAdd(item)}
                      className={`px-2 py-1 text-xs text-white rounded capitalize transition-colors ${category.color} hover:opacity-80`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {items.length > 0 && (
        <ul className="space-y-2 max-h-[250px] overflow-y-auto">
          {displayItems.map((item: ShoppingItem) => (
            <li
              key={item.id}
              className={`flex items-center gap-2 p-2 bg-[var(--color-bg-tertiary)] rounded-lg ${
                item.completed ? 'opacity-50' : ''
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0 active:scale-125 ${
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
                  className="flex-1 px-2 py-1 bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] rounded text-base outline-none"
                />
              ) : (
                <span 
                  onClick={() => startEditing(item)}
                  className={`flex-1 text-sm truncate capitalize cursor-pointer hover:text-[var(--color-accent)] ${
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
                className="text-[var(--color-text-secondary)] hover:text-rose-500 text-xs flex-shrink-0"
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
