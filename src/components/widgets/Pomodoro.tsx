import { useState, useEffect, useCallback } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { PomodoroSession } from '../../types';

const POMODORO_KEY = 'daily-dashboard-pomodoro';

const DEFAULT_POMODORO: PomodoroSession = {
  id: '1',
  duration: 25,
  remaining: 25 * 60,
  isRunning: false,
  isBreak: false,
  sessionsCompleted: 0,
  mode: 'simple',
  workDuration: 25,
  breakDuration: 5,
  totalSessions: 4,
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function CircularProgress({ 
  remaining, 
  total, 
  isBreak, 
  isRunning, 
  onClick 
}: { 
  remaining: number; 
  total: number; 
  isBreak: boolean; 
  isRunning: boolean;
  onClick: () => void;
}) {
  const radius = 120;
  const strokeWidth = 12;
  const center = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / total;
  const dashOffset = circumference * (1 - progress);

  return (
    <button 
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
      style={{ width: center * 2, height: center * 2 }}
    >
      <svg 
        width={center * 2} 
        height={center * 2} 
        className="transform -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-bg-tertiary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isBreak ? 'var(--color-accent)' : '#22c55e'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-6xl font-mono font-bold ${isRunning ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
          {formatTime(remaining)}
        </span>
      </div>
    </button>
  );
}

function ConfigPanel({ 
  workDuration, 
  breakDuration, 
  totalSessions,
  mode,
  onWorkChange, 
  onBreakChange, 
  onSessionsChange,
  onModeChange
}: { 
  workDuration: number;
  breakDuration: number;
  totalSessions: number;
  mode: 'simple' | 'session';
  onWorkChange: (v: number) => void;
  onBreakChange: (v: number) => void;
  onSessionsChange: (v: number) => void;
  onModeChange: (m: 'simple' | 'session') => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('simple')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'simple' 
                ? 'bg-[var(--color-accent)] text-white' 
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => onModeChange('session')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              mode === 'session' 
                ? 'bg-[var(--color-accent)] text-white' 
                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
            }`}
          >
            Session
          </button>
        </div>
      </div>
      <div>
        <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
          Work: {workDuration} min
        </label>
        <input
          type="range"
          min="5"
          max="60"
          step="5"
          value={workDuration}
          onChange={(e) => onWorkChange(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)]"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
          Break: {breakDuration} min
        </label>
        <input
          type="range"
          min="1"
          max="15"
          step="1"
          value={breakDuration}
          onChange={(e) => onBreakChange(Number(e.target.value))}
          className="w-full accent-[var(--color-accent)]"
        />
      </div>
      {mode === 'session' && (
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">
            Sessions: {totalSessions}
          </label>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={totalSessions}
            onChange={(e) => onSessionsChange(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>
      )}
    </div>
  );
}

function PomodoroItem({ 
  session,
  onToggle,
  onReset,
}: { 
  session: PomodoroSession;
  onToggle: () => void;
  onReset: () => void;
}) {
  const progress = session.remaining / (session.duration * 60);

  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mt-1">
          <div className={`text-2xl font-mono ${session.isRunning ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
            {formatTime(session.remaining)}
          </div>
        </div>
        <div className="w-full h-1 bg-[var(--color-bg-secondary)] rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${session.isBreak ? 'bg-[var(--color-accent)]' : 'bg-emerald-500'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onReset}
          className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center text-sm transition-colors"
        >
          ↺
        </button>
        <button
          onClick={onToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            session.isRunning 
              ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' 
              : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'
          }`}
        >
          {session.isRunning ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}

export function Pomodoro() {
  const [session, setSession] = useLocalStorage<PomodoroSession>(POMODORO_KEY, DEFAULT_POMODORO);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const getTotalDuration = useCallback((s: PomodoroSession): number => {
    return s.duration * 60;
  }, []);

  useEffect(() => {
    if (!session.isRunning) return;

    const interval = setInterval(() => {
      setSession((prev: PomodoroSession) => {
        if (prev.remaining <= 0) {
          if (prev.mode === 'simple') {
            return {
              ...prev,
              isBreak: !prev.isBreak,
              remaining: (!prev.isBreak ? prev.breakDuration : prev.workDuration) * 60,
              duration: !prev.isBreak ? prev.breakDuration : prev.workDuration,
            };
          } else {
            if (!prev.isBreak) {
              const newSessionsCompleted = prev.sessionsCompleted + 1;
              if (newSessionsCompleted >= prev.totalSessions) {
                return { ...prev, isRunning: false, sessionsCompleted: 0, isBreak: false, remaining: prev.workDuration * 60, duration: prev.workDuration };
              }
              return {
                ...prev,
                isBreak: true,
                remaining: prev.breakDuration * 60,
                duration: prev.breakDuration,
                sessionsCompleted: newSessionsCompleted,
              };
            } else {
              return {
                ...prev,
                isBreak: false,
                remaining: prev.workDuration * 60,
                duration: prev.workDuration,
              };
            }
          }
        }
        return { ...prev, remaining: Math.max(0, prev.remaining - 1) };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isRunning, session.mode, session.totalSessions, setSession]);

  const handleToggle = () => {
    setSession((prev: PomodoroSession) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleReset = () => {
    setSession((prev: PomodoroSession) => ({
      ...prev,
      remaining: prev.workDuration * 60,
      duration: prev.workDuration,
      isRunning: false,
      isBreak: false,
      sessionsCompleted: 0,
    }));
  };

  const handleWorkChange = (workDuration: number) => {
    setSession((prev: PomodoroSession) => ({
      ...prev,
      workDuration,
      duration: prev.isBreak ? prev.duration : workDuration,
      remaining: prev.isBreak ? prev.remaining : workDuration * 60,
    }));
  };

  const handleBreakChange = (breakDuration: number) => {
    setSession((prev: PomodoroSession) => ({
      ...prev,
      breakDuration,
      duration: prev.isBreak ? breakDuration : prev.duration,
      remaining: prev.isBreak ? breakDuration * 60 : prev.remaining,
    }));
  };

  const handleSessionsChange = (totalSessions: number) => {
    setSession((prev: PomodoroSession) => ({ ...prev, totalSessions }));
  };

  const handleModeChange = (mode: 'simple' | 'session') => {
    setSession((prev: PomodoroSession) => ({
      ...prev,
      mode,
      isRunning: false,
      isBreak: false,
      sessionsCompleted: 0,
      remaining: prev.workDuration * 60,
      duration: prev.workDuration,
    }));
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const configContent = (
    <ConfigPanel
      workDuration={session.workDuration}
      breakDuration={session.breakDuration}
      totalSessions={session.totalSessions}
      mode={session.mode}
      onWorkChange={handleWorkChange}
      onBreakChange={handleBreakChange}
      onSessionsChange={handleSessionsChange}
      onModeChange={handleModeChange}
    />
  );

  const footer = (
    <>
      <span className="flex-1">
        {!session.isRunning && !session.isBreak && session.sessionsCompleted === 0
          ? 'Start or resume a Pomodoro session!'
          : session.mode === 'session' 
            ? `${session.sessionsCompleted}/${session.totalSessions} sessions completed`
            : session.isBreak ? 'Break time' : 'Focus time'}
      </span>
    </>
  );

  if (isFullScreen) {
    return (
      <WidgetContainer
        title="Pomodoro"
        isFullScreen={isFullScreen}
        onFullScreenToggle={handleFullScreenToggle}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <CircularProgress
            remaining={session.remaining}
            total={getTotalDuration(session)}
            isBreak={session.isBreak}
            isRunning={session.isRunning}
            onClick={handleToggle}
          />
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-xl hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleToggle}
              className={`px-8 py-3 rounded-xl font-medium transition-colors ${
                session.isRunning
                  ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              {session.isRunning ? 'Pause' : session.remaining < session.duration * 60 ? 'Resume' : 'Start'}
            </button>
          </div>
          {session.mode === 'session' && (
            <div className="mt-6 flex gap-2">
              {Array.from({ length: session.totalSessions }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < session.sessionsCompleted
                      ? 'bg-emerald-500'
                      : i === session.sessionsCompleted && !session.isBreak && session.isRunning
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-[var(--color-bg-tertiary)]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer
      title="Pomodoro"
      footer={footer}
      configContent={configContent}
      isFullScreen={isFullScreen}
      onFullScreenToggle={handleFullScreenToggle}
    >
      <PomodoroItem
        session={session}
        onToggle={handleToggle}
        onReset={handleReset}
      />
    </WidgetContainer>
  );
}
