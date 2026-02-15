import { useEffect, useRef, useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { TimeBlock } from '../../types';

const DEFAULT_BLOCKS: TimeBlock[] = [
  { id: '1', title: 'Morning Focus', duration: 25, remaining: 25 * 60, isRunning: false },
  { id: '2', title: 'Afternoon Work', duration: 50, remaining: 50 * 60, isRunning: false },
  { id: '3', title: 'Evening Review', duration: 15, remaining: 15 * 60, isRunning: false },
];

const TIME_BLOCKS_KEY = 'daily-dashboard-timeblocks';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function TimeBlockItem({ 
  block, 
  onToggle, 
  onReset,
  onUpdateTitle 
}: { 
  block: TimeBlock;
  onToggle: (id: string) => void;
  onReset: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      onUpdateTitle(block.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="w-full bg-transparent text-base text-[var(--color-text-primary)] outline-none border-b border-[var(--color-accent)]"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors text-left"
          >
            {block.title}
          </button>
        )}
        <div className={`text-2xl font-mono mt-1 ${block.isRunning ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}`}>
          {formatTime(block.remaining)}
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onToggle(block.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            block.isRunning 
              ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' 
              : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'
          }`}
        >
          {block.isRunning ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => onReset(block.id)}
          className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center text-sm transition-colors"
        >
          ↺
        </button>
      </div>
    </div>
  );
}

export function TimeBlocks() {
  const [blocks, setBlocks] = useLocalStorage<TimeBlock[]>(TIME_BLOCKS_KEY, DEFAULT_BLOCKS);

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];
    
    blocks.forEach((block) => {
      if (block.isRunning && block.remaining > 0) {
        const interval = setInterval(() => {
          setBlocks((prev: TimeBlock[]) =>
            prev.map((b: TimeBlock) =>
              b.id === block.id && b.isRunning
                ? { ...b, remaining: Math.max(0, b.remaining - 1) }
                : b
            )
          );
        }, 1000);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [blocks, setBlocks]);

  const handleToggle = (id: string) => {
    setBlocks((prev: TimeBlock[]) =>
      prev.map((b: TimeBlock) => (b.id === id ? { ...b, isRunning: !b.isRunning } : b))
    );
  };

  const handleReset = (id: string) => {
    setBlocks((prev: TimeBlock[]) =>
      prev.map((b: TimeBlock) =>
        b.id === id ? { ...b, remaining: b.duration * 60, isRunning: false } : b
      )
    );
  };

  const handleUpdateTitle = (id: string, title: string) => {
    setBlocks((prev: TimeBlock[]) =>
      prev.map((b: TimeBlock) => (b.id === id ? { ...b, title } : b))
    );
  };

  return (
    <WidgetContainer title="Time Blocks">
      <div className="space-y-2">
        {blocks.map((block) => (
          <TimeBlockItem
            key={block.id}
            block={block}
            onToggle={handleToggle}
            onReset={handleReset}
            onUpdateTitle={handleUpdateTitle}
          />
        ))}
      </div>
    </WidgetContainer>
  );
}
