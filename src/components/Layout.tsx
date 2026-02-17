import type { ReactNode } from 'react';
import { VERSION } from '../generated/version';
import { useMode, useModeToggle, type Mode } from '../hooks/useMode';

const MODE_ICONS: Record<Mode, string> = {
  regular: '○',
  minimal: '◐',
  config: '◉',
};

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const mode = useMode();
  const toggleMode = useModeToggle();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main className={`max-w-2xl mx-auto px-4 ${mode === 'minimal' ? 'py-2 space-y-2' : 'py-4 space-y-4'}`}>
        {children}
      </main>
      <footer className="flex justify-between items-center max-w-2xl mx-auto px-4 pb-4">
        <p className="text-xs text-[var(--color-text-secondary)]">{VERSION}</p>
        <button
          onClick={toggleMode}
          className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          title={`Mode: ${mode}`}
        >
          {MODE_ICONS[mode]}
        </button>
      </footer>
    </div>
  );
}
