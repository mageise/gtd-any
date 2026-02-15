/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface MinimalModeContextType {
  minimalMode: boolean;
  toggleMinimalMode: () => void;
}

export const MinimalModeContext = createContext<MinimalModeContextType | undefined>(undefined);

const MINIMAL_MODE_KEY = 'daily-dashboard-minimal-mode';

export function MinimalModeProvider({ children }: { children: ReactNode }) {
  const [minimalMode, setMinimalMode] = useState(() => {
    try {
      const stored = localStorage.getItem(MINIMAL_MODE_KEY);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const toggleMinimalMode = () => {
    setMinimalMode((prev: boolean) => {
      const newValue = !prev;
      try {
        localStorage.setItem(MINIMAL_MODE_KEY, JSON.stringify(newValue));
      } catch {
        // ignore
      }
      return newValue;
    });
  };

  return (
    <MinimalModeContext.Provider value={{ minimalMode, toggleMinimalMode }}>
      {children}
    </MinimalModeContext.Provider>
  );
}

export function useMinimalMode(): boolean {
  const context = useContext(MinimalModeContext);
  if (!context) {
    throw new Error('useMinimalMode must be used within MinimalModeProvider');
  }
  return context.minimalMode;
}

export function useToggleMinimalMode(): () => void {
  const context = useContext(MinimalModeContext);
  if (!context) {
    throw new Error('useToggleMinimalMode must be used within MinimalModeProvider');
  }
  return context.toggleMinimalMode;
}
