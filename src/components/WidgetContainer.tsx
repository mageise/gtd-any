import { useEffect, type ReactNode } from 'react';
import { useMode } from '../hooks/useMode';

export interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  configContent?: ReactNode;
  isFullScreen?: boolean;
  onFullScreenToggle?: () => void;
  className?: string;
}

export function WidgetContainer({ title, children, footer, configContent, isFullScreen, onFullScreenToggle, className = '' }: WidgetContainerProps) {
  const mode = useMode();

  const showTitle = mode === 'regular' || mode === 'config';
  const showFooter = mode === 'regular' || mode === 'config';
  const showConfig = mode === 'config' && configContent;

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1';
      meta.id = 'fullscreen-viewport';
      document.head.appendChild(meta);
    } else {
      document.body.style.overflow = '';
      
      const meta = document.getElementById('fullscreen-viewport');
      if (meta) meta.remove();
    }
    
    return () => {
      document.body.style.overflow = '';
      const meta = document.getElementById('fullscreen-viewport');
      if (meta) meta.remove();
    };
  }, [isFullScreen]);

  if (isFullScreen) {
    return (
      <div 
        className="fixed inset-0 h-screen w-screen z-[100] bg-[var(--color-bg-secondary)] flex flex-col"
        style={{ 
          userSelect: 'none', 
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {title}
          </h2>
          {onFullScreenToggle && (
            <button
              onClick={onFullScreenToggle}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              title="Exit fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            </button>
          )}
        </div>
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[var(--color-bg-secondary)] rounded-2xl ${mode === 'minimal' ? 'p-2' : 'p-4'} shadow-sm border border-[var(--color-bg-tertiary)] w-full ${className} flex flex-col`}>
      {showTitle && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            {title}
          </h2>
          {onFullScreenToggle && (
            <button
              onClick={onFullScreenToggle}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              title="Fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          )}
        </div>
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
