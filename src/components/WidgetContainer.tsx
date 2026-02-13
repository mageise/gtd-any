import type { ReactNode } from 'react';

interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: 'quarter' | 'half' | 'full' | 'tall';
}

export function WidgetContainer({ title, children, footer, className = '', size = 'full' }: WidgetContainerProps) {
  const widthClass = {
    quarter: 'w-1/4',
    half: 'w-1/2',
    full: 'w-full',
    tall: 'w-full',
  }[size];

  return (
    <div className={`bg-[var(--color-bg-secondary)] rounded-2xl p-4 shadow-sm border border-[var(--color-bg-tertiary)] ${widthClass} ${className} flex flex-col`}>
      <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
        {title}
      </h2>
      <div className="flex-1">
        {children}
      </div>
      {footer && (
        <div className="mt-4">
          <footer className="text-xs text-[var(--color-text-secondary)] h-5 flex items-center">
            {footer}
          </footer>
        </div>
      )}
    </div>
  );
}
