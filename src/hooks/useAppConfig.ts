import { useState, useCallback } from 'react';
import type { WidgetConfig, AppConfig } from '../types';

const CONFIG_KEY = 'daily-dashboard-config';

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: 'btc-price', name: 'BTC Price', enabled: true },
  { id: 'stock-price', name: 'Stock Price', enabled: true },
  { id: 'tetris', name: 'Tetris', enabled: true },
  { id: 'pomodoro', name: 'Pomodoro', enabled: true },
  { id: 'inbox-zero', name: 'Inbox Zero', enabled: true },
  { id: 'tasks-today', name: "Today's Tasks", enabled: true },
  { id: 'shopping-list', name: 'Shopping List', enabled: true },
];

const DEFAULT_CONFIG: AppConfig = {
  widgets: DEFAULT_WIDGETS,
};

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppConfig;
        if (parsed.widgets && Array.isArray(parsed.widgets)) {
          const mergedWidgets = DEFAULT_WIDGETS.map(defaultWidget => {
            const stored = parsed.widgets.find(w => w.id === defaultWidget.id);
            return stored ? { ...defaultWidget, enabled: stored.enabled } : defaultWidget;
          });
          return { ...parsed, widgets: mergedWidgets };
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  const saveConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  }, []);

  const getWidgets = useCallback((): WidgetConfig[] => {
    return config.widgets;
  }, [config.widgets]);

  const getEnabledWidgets = useCallback((): WidgetConfig[] => {
    return config.widgets.filter(w => w.enabled);
  }, [config.widgets]);

  const toggleWidget = useCallback((id: string) => {
    const newWidgets = config.widgets.map(w =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    );
    saveConfig({ ...config, widgets: newWidgets });
  }, [config, saveConfig]);

  const moveWidget = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const newWidgets = [...config.widgets];
    const [moved] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, moved);
    saveConfig({ ...config, widgets: newWidgets });
  }, [config, saveConfig]);

  const resetToDefaults = useCallback(() => {
    saveConfig(DEFAULT_CONFIG);
  }, [saveConfig]);

  return {
    config,
    getWidgets,
    getEnabledWidgets,
    toggleWidget,
    moveWidget,
    resetToDefaults,
  };
}
