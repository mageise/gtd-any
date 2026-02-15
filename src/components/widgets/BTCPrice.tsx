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
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
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
        setFinance({
          btcPrice: data.bitcoin.eur,
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

  return (
    <WidgetContainer title="BTC Price" footer={finance.lastUpdated ? `Updated ${formatTime(finance.lastUpdated)}` : undefined}>
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
