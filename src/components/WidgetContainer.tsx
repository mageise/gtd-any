import type { ReactNode } from 'react';
import { useMinimalMode } from '../hooks/useMinimalMode';

export interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function WidgetContainer({ title, children, footer, className = '' }: WidgetContainerProps) {
  const minimalMode = useMinimalMode();

  return (
    <div className={`bg-[var(--color-bg-secondary)] rounded-2xl ${minimalMode ? 'p-2' : 'p-4'} shadow-sm border border-[var(--color-bg-tertiary)] w-full ${className} flex flex-col`}>
      {!minimalMode && (
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          {title}
        </h2>
      )}
      <div className="flex-1">
        {children}
      </div>
      {!minimalMode && footer && (
        <div className="mt-3">
          <footer className="text-xs text-[var(--color-text-secondary)] h-5 flex items-center">
            {footer}
          </footer>
        </div>
      )}
    </div>
  );
}
