import type { ReactNode } from 'react';
import { VERSION } from '../generated/version';
import { useMinimalMode, useToggleMinimalMode } from '../hooks/useMinimalMode';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const minimalMode = useMinimalMode();
  const toggleMinimalMode = useToggleMinimalMode();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main className={`max-w-2xl mx-auto px-4 ${minimalMode ? 'py-2 space-y-2' : 'py-4 space-y-4'}`}>
        {children}
      </main>
      <footer className="flex justify-between items-center max-w-2xl mx-auto px-4 pb-4">
        <p className="text-xs text-[var(--color-text-secondary)]">{VERSION}</p>
        <button
          onClick={toggleMinimalMode}
          className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
          title="Toggle minimal mode"
        >
          ◉
        </button>
      </footer>
    </div>
  );
}
