import type { ReactNode } from 'react';

export interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function WidgetContainer({ title, children, footer, className = '' }: WidgetContainerProps) {
  return (
    <div className={`bg-[var(--color-bg-secondary)] rounded-2xl p-4 shadow-sm border border-[var(--color-bg-tertiary)] w-full ${className} flex flex-col`}>
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
