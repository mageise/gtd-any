import { VERSION } from '../generated/version';
import { useMode, useModeActions } from '../hooks/useMode';
import type { WidgetConfig } from '../types';

interface ConfigAreaProps {
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
  onMoveWidget: (fromIndex: number, toIndex: number) => void;
}

export function ConfigArea({ widgets, onToggleWidget, onMoveWidget }: ConfigAreaProps) {
  const mode = useMode();
  const { toggleMinimal, openConfig, closeConfig } = useModeActions();

  const enabledCount = widgets.filter(w => w.enabled).length;
  const totalCount = widgets.length;

  const renderCompactBar = () => {
    if (mode === 'regular') {
      return (
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">
              {enabledCount}/{totalCount} widgets active
            </span>
          </div>
          <div className="justify-self-center">
            <button
              onClick={toggleMinimal}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
              title="Switch to minimal mode"
            >
              ●
            </button>
          </div>
          <div className="justify-self-end">
            <button
              onClick={openConfig}
              className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
            >
              Open settings
            </button>
          </div>
        </div>
      );
    }

    if (mode === 'minimal') {
      return (
        <div className="flex justify-center items-center">
          <button
            onClick={toggleMinimal}
            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
            title="Switch to regular mode"
          >
            ◐
          </button>
        </div>
      );
    }

    return null;
  };

  const renderConfigContent = () => (
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
  );

  const renderConfigBar = () => (
    <div className="grid grid-cols-3 items-center">
      <div className="justify-self-start">
        <span className="text-xs text-[var(--color-text-secondary)]">{VERSION}</span>
      </div>
      <div className="justify-self-center" />
      <div className="justify-self-end">
        <button
          onClick={closeConfig}
          className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
        >
          Close settings
        </button>
      </div>
    </div>
  );

  if (mode === 'config') {
    return (
      <div
        className="bg-[var(--color-bg-secondary)] rounded-t-2xl shadow-sm border border-[var(--color-bg-tertiary)] w-full"
        style={{ borderBottom: 'none' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Settings
            </h2>
          </div>
          {renderConfigContent()}
        </div>
        <div className="px-4 pb-4">
          {renderConfigBar()}
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[var(--color-bg-secondary)] rounded-t-2xl shadow-sm border border-[var(--color-bg-tertiary)] w-full"
      style={{ borderBottom: 'none' }}
    >
      <div className={`${mode === 'minimal' ? 'p-2' : 'p-4'}`}>
        {renderCompactBar()}
      </div>
    </div>
  );
}
