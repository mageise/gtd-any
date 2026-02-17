import type { ReactNode } from 'react';
import { useMode } from '../hooks/useMode';

interface WidgetPairProps {
  children: ReactNode;
}

export function WidgetPair({ children }: WidgetPairProps) {
  const mode = useMode();

  const isConfig = mode === 'config';
  const isMinimal = mode === 'minimal';

  return (
    <div className={`flex ${isConfig ? 'flex-col gap-4' : isMinimal ? 'gap-2' : 'gap-4'} w-full`}>
      {children}
    </div>
  );
}
