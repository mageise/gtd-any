import { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { StockData } from '../../types';

const STOCK_KEY = 'daily-dashboard-stock';

const DEFAULT_STOCK: StockData = {
  ticker: 'APC.F',
  stockPrice: 0,
  previousPrice: undefined,
  lastUpdated: null,
  companyName: 'Apple',
};

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500',
];

function getColor(ticker: string): string {
  const hash = ticker.toUpperCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
}

function getFirstLetter(companyName: string | undefined, ticker: string): string {
  if (!companyName) return ticker.charAt(0).toUpperCase();
  return companyName.charAt(0).toUpperCase();
}

function getDisplayName(companyName: string | undefined, ticker: string): string {
  if (!companyName) return ticker;
  return companyName.charAt(0).toUpperCase() + companyName.slice(1).toLowerCase();
}

function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Today ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday ${timeStr}`;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + timeStr;
}

function isNewDay(timestamp: number | null): boolean {
  if (!timestamp) return true;
  const lastDate = new Date(timestamp);
  const today = new Date();
  return lastDate.toDateString() !== today.toDateString();
}

function calculateChange(current: number, previous: number | undefined): { percent: number; direction: 'up' | 'down' | 'none' } | null {
  if (!previous || previous === 0) return null;
  const percent = ((current - previous) / previous) * 100;
  const direction = percent > 0 ? 'up' : percent < 0 ? 'down' : 'none';
  return { percent: Math.abs(percent), direction };
}

export function StockPrice() {
  const [stock, setStock] = useLocalStorage<StockData>(STOCK_KEY, DEFAULT_STOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tickerInput, setTickerInput] = useState('');

  const fetchPrice = async (ticker?: string) => {
    const targetTicker = ticker || stock.ticker;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/${targetTicker}?interval=1d&range=1d`
      );
      if (response.ok) {
        const data = await response.json();
        const result = data.chart.result?.[0];
        if (result) {
          const price = result.meta.regularMarketPrice;
          const currency = result.meta.currency;
          const fullName = result.meta.shortName || result.meta.longName;
          const companyName = fullName ? fullName.split(' ')[0] : 'Unknown';
          const newDay = isNewDay(stock.lastUpdated);
          const tickerChanged = ticker && ticker !== stock.ticker;

          setStock({
            ticker: targetTicker,
            stockPrice: price,
            previousPrice: tickerChanged ? undefined : (newDay && stock.stockPrice > 0 ? stock.stockPrice : stock.previousPrice),
            lastUpdated: Date.now(),
            companyName: companyName,
            currency: currency,
          });
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = () => {
    setTickerInput(stock.ticker);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newTicker = tickerInput.trim().toUpperCase();
    if (newTicker && newTicker !== stock.ticker) {
      fetchPrice(newTicker);
    }
    setIsEditing(false);
  };

  const getFooter = () => {
    if (!stock.lastUpdated) return 'Tap icon to fetch price';

    const time = formatTime(stock.lastUpdated);
    const change = calculateChange(stock.stockPrice, stock.previousPrice);

    if (change) {
      const arrow = change.direction === 'up' ? '▲' : change.direction === 'down' ? '▼' : '';
      const colorClass = change.direction === 'up' ? 'text-emerald-500' : change.direction === 'down' ? 'text-rose-500' : '';
      const percentStr = change.percent.toFixed(2) + '%';
      return (
        <span>
          {time} <span className={colorClass}>{arrow} {percentStr}</span>
        </span>
      );
    }
    return time;
  };

  const circleColor = getColor(stock.ticker);
  const firstLetter = getFirstLetter(stock.companyName, stock.ticker);
  const displayName = getDisplayName(stock.companyName, stock.ticker);

  return (
    <WidgetContainer title="Stock Price" footer={getFooter()}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => fetchPrice()}
          disabled={loading}
          className={`w-8 h-8 rounded-full ${circleColor} flex items-center justify-center text-lg text-white font-bold select-none cursor-pointer disabled:opacity-70`}
        >
          {loading ? '...' : firstLetter}
        </button>
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full text-base bg-transparent border-b border-[var(--color-accent)] outline-none text-[var(--color-text-secondary)]"
            />
          ) : (
            <p
              onClick={handleEditStart}
              className="text-xs text-[var(--color-text-secondary)] cursor-pointer hover:underline truncate"
            >
              {displayName}
            </p>
          )}
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {loading ? '...' : stock.stockPrice > 0 ? formatPrice(stock.stockPrice, stock.currency) : '—'}
          </p>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">
          Could not fetch price. Tap to retry.
        </p>
      )}
    </WidgetContainer>
  );
}
