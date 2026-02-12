import { useEffect, useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Quote } from '../../types';

const FALLBACK_QUOTES: Quote[] = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'Small daily improvements are the key to staggering long-term results.', author: 'Robin Sharma' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'It is not that we have a short time to live, but that we waste a lot of it.', author: 'Seneca' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
];

const QUOTE_KEY = 'daily-dashboard-quote';
const QUOTE_DATE_KEY = 'daily-dashboard-quote-date';

export function DailyQuote() {
  const [quote, setQuote] = useLocalStorage<Quote | null>(QUOTE_KEY, null);
  const [quoteDate, setQuoteDate] = useLocalStorage<string>(QUOTE_DATE_KEY, '');
  const [loading, setLoading] = useState(false);

  const today = new Date().toDateString();

  useEffect(() => {
    if (quoteDate !== today) {
      fetchQuote();
    }
  }, [quoteDate, today]);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.quotable.io/random?tags=inspirational|success');
      if (response.ok) {
        const data = await response.json();
        setQuote({ text: data.content, author: data.author });
      } else {
        const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
        setQuote(randomQuote);
      }
    } catch {
      const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(randomQuote);
    } finally {
      setQuoteDate(today);
      setLoading(false);
    }
  };

  return (
    <WidgetContainer title="Daily Quote" className="!py-2 !px-4">
      <div className="flex items-center justify-center min-h-[60px]">
        {loading ? (
          <span className="text-sm text-[var(--color-text-secondary)]">Loading...</span>
        ) : quote ? (
          <p className="text-sm text-center text-[var(--color-text-primary)] italic">
            "{quote.text}" <span className="not-italic text-[var(--color-text-secondary)]">— {quote.author}</span>
          </p>
        ) : (
          <button
            onClick={fetchQuote}
            className="text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Get your daily quote
          </button>
        )}
      </div>
    </WidgetContainer>
  );
}
