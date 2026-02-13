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

interface FinanceProps {
  size?: 'quarter' | 'half' | 'full' | 'tall';
}

export function Finance({ size = 'full' }: FinanceProps) {
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
    <WidgetContainer title="Finance" size={size} footer={finance.lastUpdated ? `Updated ${formatTime(finance.lastUpdated)}` : undefined}>
      <div className="flex items-center justify-between">
        <button
          onClick={fetchPrice}
          disabled={loading}
          className="p-0 bg-transparent text-left inline-flex items-center gap-3 disabled:opacity-70"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-xl text-white font-bold select-none cursor-pointer">
            ₿
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">Bitcoin</p>
            <p className="text-xl font-semibold text-[var(--color-text-primary)]">
              {loading ? '...' : finance.btcPrice > 0 ? formatPrice(finance.btcPrice) : '—'}
            </p>
          </div>
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">
          Could not fetch price. Tap BTC to retry.
        </p>
      )}
    </WidgetContainer>
  );
}
