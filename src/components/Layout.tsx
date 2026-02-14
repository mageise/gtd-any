import type { ReactNode } from 'react';
import { VERSION } from '../generated/version';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {children}
      </main>
      <footer className="text-center pb-4">
        <p className="text-xs text-[var(--color-text-secondary)]">{VERSION}</p>
      </footer>
    </div>
  );
}
