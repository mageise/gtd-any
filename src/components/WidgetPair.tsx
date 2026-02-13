import type { ReactNode } from 'react';

interface WidgetPairProps {
  children: ReactNode;
}

export function WidgetPair({ children }: WidgetPairProps) {
  return (
    <div className="flex gap-4 w-full">
      {children}
    </div>
  );
}
