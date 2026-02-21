import { VERSION } from '../generated/version';
import { useMode, useModeToggle, type Mode } from '../hooks/useMode';
import type { WidgetConfig } from '../types';

const MODE_ICONS: Record<Mode, string> = {
  regular: '○',
  minimal: '◐',
  config: '◉',
};

interface ConfigAreaProps {
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
  onMoveWidget: (fromIndex: number, toIndex: number) => void;
}

export function ConfigArea({ widgets, onToggleWidget, onMoveWidget }: ConfigAreaProps) {
  const mode = useMode();
  const toggleMode = useModeToggle();
  const isConfigMode = mode === 'config';

  return (
    <div
      className="bg-[var(--color-bg-secondary)] rounded-t-2xl shadow-sm border border-[var(--color-bg-tertiary)] w-full"
      style={{ borderBottom: 'none' }}
    >
      <div className={`${mode === 'minimal' ? 'p-2' : 'p-4'}`}>
        {isConfigMode ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                Config
              </h2>
              <button
                onClick={toggleMode}
                className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                title={`Mode: ${mode}`}
              >
                {MODE_ICONS[mode]}
              </button>
            </div>
            <div className="space-y-1">
              {widgets.map((widget, index) => (
                <div
                  key={widget.id}
                  className="flex items-center gap-2 bg-[var(--color-bg-primary)] px-3 py-2 rounded-lg"
                >
                  <button
                    onClick={() => onMoveWidget(index, index - 1)}
                    disabled={index === 0}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => onMoveWidget(index, index + 1)}
                    disabled={index === widgets.length - 1}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ▼
                  </button>
                  <span className="flex-1 text-sm text-[var(--color-text-primary)]">
                    {widget.name}
                  </span>
                  <button
                    onClick={() => onToggleWidget(widget.id)}
                    className={`w-8 h-5 rounded-full transition-colors ${
                      widget.enabled
                        ? 'bg-[var(--color-accent)]'
                        : 'bg-[var(--color-bg-tertiary)]'
                    }`}
                    title={widget.enabled ? 'Disable' : 'Enable'}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        widget.enabled ? 'translate-x-4' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-xs text-[var(--color-text-secondary)]">{VERSION}</p>
            <button
              onClick={toggleMode}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              title={`Mode: ${mode}`}
            >
              {MODE_ICONS[mode]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
