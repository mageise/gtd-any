import type { ReactNode } from 'react';
import { useMinimalMode } from '../hooks/useMinimalMode';

interface WidgetPairProps {
  children: ReactNode;
}

export function WidgetPair({ children }: WidgetPairProps) {
  const minimalMode = useMinimalMode();

  return (
    <div className={`flex ${minimalMode ? 'gap-2' : 'gap-4'} w-full`}>
      {children}
    </div>
  );
}
