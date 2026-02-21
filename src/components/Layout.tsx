import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <main className={`max-w-2xl mx-auto px-4 py-4 space-y-4`}>
        {children}
      </main>
    </div>
  );
}
