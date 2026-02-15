import { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { StockData } from '../../types';

const STOCK_KEY = 'daily-dashboard-stock';

const DEFAULT_STOCK: StockData = {
  stockPrice: 0,
  lastUpdated: null,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
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

export function StockPrice() {
  const [stock, setStock] = useLocalStorage<StockData>(STOCK_KEY, DEFAULT_STOCK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        'https://corsproxy.io/?https://query1.finance.yahoo.com/v8/finance/chart/8CF.F?interval=1d&range=1d'
      );
      if (response.ok) {
        const data = await response.json();
        const price = data.chart.result[0].meta.regularMarketPrice;
        const newDay = isNewDay(stock.lastUpdated);

        setStock({
          stockPrice: price,
          previousPrice: newDay && stock.stockPrice > 0 ? stock.stockPrice : stock.previousPrice,
          lastUpdated: Date.now(),
        });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getFooter = () => {
    if (!stock.lastUpdated) return 'Tap icon to fetch price';

    const time = formatTime(stock.lastUpdated);
    if (stock.previousPrice && stock.stockPrice > stock.previousPrice) {
      return <span>{time} <span className="text-emerald-500">▲</span></span>;
    }
    if (stock.previousPrice && stock.stockPrice < stock.previousPrice) {
      return <span>{time} <span className="text-rose-500">▼</span></span>;
    }
    return time;
  };

  return (
    <WidgetContainer title="Stock Price" footer={getFooter()}>
      <div className="flex items-center gap-3">
        <button
          onClick={fetchPrice}
          disabled={loading}
          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-lg text-white font-bold select-none cursor-pointer disabled:opacity-70"
        >
          ☁
        </button>
        <div>
          <p className="text-xs text-[var(--color-text-secondary)]">Cloudflare</p>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {loading ? '...' : stock.stockPrice > 0 ? formatPrice(stock.stockPrice) : '—'}
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
