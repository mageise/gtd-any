# Daily Dashboard

A beautiful, mobile-first personal dashboard with 5 productivity widgets. Built with React, TypeScript, Vite, and Tailwind CSS.

## Widgets (in order)

1. **Daily Quote** - Inspirational quote that refreshes each day (API: quotable.io, fallback to local array)
2. **Time Blocks** - 3 preset time blocks with Pomodoro-style timers (editable titles)
3. **Inbox Zero** - Quick capture for thoughts/tasks → graduate to tasks or delete
4. **Today's Tasks** - Checklist with completion tracking, connected to Inbox
5. **Finance** - Live BTC price (CoinGecko API), auto-refreshes every 5 minutes

## Architecture

### Data Storage
All data persisted in localStorage:
- `daily-dashboard-quote` / `daily-dashboard-quote-date`
- `daily-dashboard-timeblocks`
- `daily-dashboard-inbox`
- `daily-dashboard-tasks`
- `daily-dashboard-finance`

### Project Structure
```
src/
├── components/
│   ├── widgets/
│   │   ├── DailyQuote.tsx
│   │   ├── TimeBlocks.tsx
│   │   ├── InboxZero.tsx
│   │   ├── TodaysTasks.tsx
│   │   └── Finance.tsx
│   ├── Layout.tsx
│   └── WidgetContainer.tsx
├── hooks/
│   └── useLocalStorage.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

### TypeScript Types (src/types/index.ts)
- `Quote` - text, author
- `TimeBlock` - id, title, duration (min), remaining (sec), isRunning
- `InboxItem` - id, text, createdAt
- `Task` - id, text, completed, createdAt
- `FinanceData` - btcPrice, lastUpdated

## Future Ideas

### Widgets
- [ ] Add more widgets (Habit Tracker, Weather, Calendar, Notes)
- [ ] Make widgets reorderable (drag-and-drop)
- [ ] Allow enabling/disabling widgets
- [ ] Widget settings/config

### Time Blocks
- [ ] Link Time Blocks to Tasks (auto-suggest related tasks when block starts)
- [ ] Add custom time blocks (not just presets)
- [ ] Break timer between blocks

### Tasks & Inbox
- [ ] Task categories/tags
- [ ] Priority levels
- [ ] Due dates
- [ ] Recurring tasks

### Finance
- [ ] Multiple cryptocurrencies
- [ ] Price alerts
- [ ] Portfolio tracking (manual entry)

### Data
- [ ] Export/Import data (JSON)
- [ ] Cloud sync (Firebase/Supabase) for cross-device
- [ ] Data backup

### UI/UX
- [ ] Dark/Light mode toggle (currently system-only)
- [ ] Widget animations
- [ ] Keyboard shortcuts
- [ ] PWA support (offline-first)

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- localStorage (no backend)
