/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

export type Mode = 'regular' | 'minimal' | 'config';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

const MODE_KEY = 'daily-dashboard-mode';

const MODES: Mode[] = ['regular', 'minimal', 'config'];

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    try {
      const stored = localStorage.getItem(MODE_KEY);
      return (stored as Mode) || 'regular';
    } catch {
      return 'regular';
    }
  });

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(MODE_KEY, newMode);
    } catch {
      // ignore
    }
  };

  const toggleMode = () => {
    const currentIndex = MODES.indexOf(mode);
    const nextIndex = (currentIndex + 1) % MODES.length;
    setMode(MODES[nextIndex]);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): Mode {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context.mode;
}

export function useSetMode(): (mode: Mode) => void {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useSetMode must be used within ModeProvider');
  }
  return context.setMode;
}

export function useModeToggle(): () => void {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useModeToggle must be used within ModeProvider');
  }
  return context.toggleMode;
}

export function useModeActions() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useModeActions must be used within ModeProvider');
  }

  const toggleMinimal = () => {
    const newMode: Mode = context.mode === 'regular' ? 'minimal' : 'regular';
    context.setMode(newMode);
  };

  const openConfig = () => {
    context.setMode('config');
  };

  const closeConfig = () => {
    context.setMode('regular');
  };

  return {
    toggleMinimal,
    openConfig,
    closeConfig,
  };
}
