import type { ReactNode } from 'react';
import { useMode } from '../hooks/useMode';

export interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  configContent?: ReactNode;
  className?: string;
}

export function WidgetContainer({ title, children, footer, configContent, className = '' }: WidgetContainerProps) {
  const mode = useMode();

  const showTitle = mode === 'regular' || mode === 'config';
  const showFooter = mode === 'regular' || mode === 'config';
  const showConfig = mode === 'config' && configContent;

  return (
    <div className={`bg-[var(--color-bg-secondary)] rounded-2xl ${mode === 'minimal' ? 'p-2' : 'p-4'} shadow-sm border border-[var(--color-bg-tertiary)] w-full ${className} flex flex-col`}>
      {showTitle && (
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          {title}
        </h2>
      )}
      <div className="flex-1">
        {children}
      </div>
      {showConfig && (
        <div className="mt-3 pt-3 border-t border-[var(--color-bg-tertiary)]">
          {configContent}
        </div>
      )}
      {showFooter && footer && (
        <div className="mt-3">
          <footer className="text-xs text-[var(--color-text-secondary)] h-5 flex items-center">
            {footer}
          </footer>
        </div>
      )}
    </div>
  );
}
