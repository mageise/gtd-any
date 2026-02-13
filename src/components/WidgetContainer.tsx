import type { ReactNode } from 'react';

interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  size?: 'full' | 'half';
}

export function WidgetContainer({ title, children, className = '', size = 'full' }: WidgetContainerProps) {
  return (
    <div className={`bg-[var(--color-bg-secondary)] rounded-2xl p-4 shadow-sm border border-[var(--color-bg-tertiary)] ${size === 'half' ? 'w-1/2' : 'w-full'} ${className}`}>
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
