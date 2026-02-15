import { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { FinanceData } from '../../types';

const FINANCE_KEY = 'daily-dashboard-finance';

const DEFAULT_FINANCE: FinanceData = {
  btcPrice: 0,
  lastUpdated: null,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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

export function BTCPrice() {
  const [finance, setFinance] = useLocalStorage<FinanceData>(FINANCE_KEY, DEFAULT_FINANCE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur'
      );
      if (response.ok) {
        const data = await response.json();
        const newPrice = data.bitcoin.eur;
        const newDay = isNewDay(finance.lastUpdated);

        setFinance({
          btcPrice: newPrice,
          previousPrice: newDay && finance.btcPrice > 0 ? finance.btcPrice : finance.previousPrice,
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
    if (!finance.lastUpdated) return 'Tap icon to fetch price';

    const time = formatTime(finance.lastUpdated);
    if (finance.previousPrice && finance.btcPrice > finance.previousPrice) {
      return <span>{time} <span className="text-emerald-500">▲</span></span>;
    }
    if (finance.previousPrice && finance.btcPrice < finance.previousPrice) {
      return <span>{time} <span className="text-rose-500">▼</span></span>;
    }
    return time;
  };

  return (
    <WidgetContainer title="BTC Price" footer={getFooter()}>
      <div className="flex items-center gap-3">
        <button
          onClick={fetchPrice}
          disabled={loading}
          className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-lg text-white font-bold select-none cursor-pointer disabled:opacity-70"
        >
          ₿
        </button>
        <div>
          <p className="text-xs text-[var(--color-text-secondary)]">Bitcoin</p>
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">
            {loading ? '...' : finance.btcPrice > 0 ? formatPrice(finance.btcPrice) : '—'}
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
