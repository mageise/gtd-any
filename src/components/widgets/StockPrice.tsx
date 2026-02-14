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
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
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
        setStock({
          stockPrice: price,
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
    <WidgetContainer title="Stock Price" footer={stock.lastUpdated ? `Updated ${formatTime(stock.lastUpdated)}` : undefined}>
      <div className="flex items-center justify-between">
        <button
          onClick={fetchPrice}
          disabled={loading}
          className="p-0 bg-transparent text-left inline-flex items-center gap-3 disabled:opacity-70"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl text-white font-bold select-none cursor-pointer">
            ☁
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-secondary)]">Cloudflare</p>
            <p className="text-xl font-semibold text-[var(--color-text-primary)]">
              {loading ? '...' : stock.stockPrice > 0 ? formatPrice(stock.stockPrice) : '—'}
            </p>
          </div>
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">
          Could not fetch price. Tap to retry.
        </p>
      )}
    </WidgetContainer>
  );
}
