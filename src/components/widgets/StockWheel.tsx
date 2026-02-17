import { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { StockData, StockList } from '../../types';

const STOCK_LIST_KEY = 'daily-dashboard-stocks';

const DEFAULT_STOCK: StockData = {
  ticker: 'APC.F',
  stockPrice: 0,
  previousPrice: undefined,
  lastUpdated: null,
  companyName: 'Apple',
};

const DEFAULT_STOCK_LIST: StockList = {
  stocks: [DEFAULT_STOCK],
  activeIndex: 0,
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

export function StockWheel() {
  const [stockList, setStockList] = useLocalStorage<StockList>(STOCK_LIST_KEY, DEFAULT_STOCK_LIST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tickerInput, setTickerInput] = useState('');
  const [newTickerInput, setNewTickerInput] = useState('');

  const activeStock = stockList.stocks[stockList.activeIndex] || stockList.stocks[0];

  const fetchPrice = async (ticker?: string, stockIndex?: number) => {
    const targetIndex = stockIndex !== undefined ? stockIndex : stockList.activeIndex;
    const targetStock = stockList.stocks[targetIndex];
    const targetTicker = ticker || targetStock?.ticker;
    
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
          const newDay = isNewDay(targetStock?.lastUpdated);
          const tickerChanged = ticker && ticker !== targetStock?.ticker;

          setStockList(prev => {
            const newStocks = [...prev.stocks];
            newStocks[targetIndex] = {
              ticker: targetTicker,
              stockPrice: price,
              previousPrice: tickerChanged ? undefined : (newDay && (targetStock?.stockPrice || 0) > 0 ? targetStock?.stockPrice : targetStock?.previousPrice),
              lastUpdated: Date.now(),
              companyName: companyName,
              currency: currency,
            };
            return { ...prev, stocks: newStocks };
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
    setTickerInput(activeStock.ticker);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newTicker = tickerInput.trim().toUpperCase();
    if (newTicker && newTicker !== activeStock.ticker) {
      fetchPrice(newTicker);
    }
    setIsEditing(false);
  };

  const handleAddStock = () => {
    const ticker = newTickerInput.trim().toUpperCase();
    if (!ticker) return;
    
    const newStock: StockData = {
      ticker,
      stockPrice: 0,
      previousPrice: undefined,
      lastUpdated: null,
      companyName: ticker,
    };
    
    setStockList(prev => ({
      stocks: [...prev.stocks, newStock],
      activeIndex: prev.stocks.length,
    }));
    setNewTickerInput('');
    fetchPrice(ticker, stockList.stocks.length);
  };

  const handleRemoveStock = (index: number) => {
    if (stockList.stocks.length <= 1) return;
    
    setStockList(prev => {
      const newStocks = prev.stocks.filter((_, i) => i !== index);
      let newActiveIndex = prev.activeIndex;
      if (index <= prev.activeIndex && prev.activeIndex > 0) {
        newActiveIndex = prev.activeIndex - 1;
      }
      if (newActiveIndex >= newStocks.length) {
        newActiveIndex = newStocks.length - 1;
      }
      return { stocks: newStocks, activeIndex: newActiveIndex };
    });
  };

  const getFooter = () => {
    if (!activeStock.lastUpdated) return 'Tap icon to fetch price';

    const time = formatTime(activeStock.lastUpdated);
    const change = calculateChange(activeStock.stockPrice, activeStock.previousPrice);

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

  const circleColor = getColor(activeStock.ticker);
  const firstLetter = getFirstLetter(activeStock.companyName, activeStock.ticker);
  const displayName = getDisplayName(activeStock.companyName, activeStock.ticker);

  const renderSlider = () => {
    if (stockList.stocks.length <= 1) return null;
    return (
      <div className="flex items-center gap-2 mt-3">
        <input
          type="range"
          min={0}
          max={stockList.stocks.length - 1}
          value={stockList.activeIndex}
          onChange={(e) => setStockList(prev => ({ ...prev, activeIndex: parseInt(e.target.value) }))}
          className="w-full h-1 bg-[var(--color-bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
        />
        <span className="text-xs whitespace-nowrap">{stockList.activeIndex + 1}/{stockList.stocks.length}</span>
      </div>
    );
  };

  const configContent = (
    <div className="space-y-2">
      <p className="text-xs text-[var(--color-text-secondary)] mb-2">Manage your stocks</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={newTickerInput}
          onChange={(e) => setNewTickerInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleAddStock()}
          placeholder="Add ticker..."
          className="flex-1 text-sm bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded px-2 py-1 outline-none focus:border-[var(--color-accent)]"
        />
        <button
          onClick={handleAddStock}
          className="text-sm bg-[var(--color-accent)] text-white px-3 py-1 rounded hover:opacity-90"
        >
          Add
        </button>
      </div>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {stockList.stocks.map((stock, index) => (
          <div key={stock.ticker + index} className="flex items-center justify-between text-sm bg-[var(--color-bg-primary)] px-2 py-1 rounded">
            <span>{stock.ticker} - {stock.companyName || 'Unknown'}</span>
            <button
              onClick={() => handleRemoveStock(index)}
              className="text-red-500 hover:text-red-400"
              disabled={stockList.stocks.length <= 1}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <WidgetContainer title="Stock Wheel" footer={getFooter()} configContent={configContent}>
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
            {loading ? '...' : activeStock.stockPrice > 0 ? formatPrice(activeStock.stockPrice, activeStock.currency) : '—'}
          </p>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">
          Could not fetch price. Tap to retry.
        </p>
      )}
      {renderSlider()}
    </WidgetContainer>
  );
}
