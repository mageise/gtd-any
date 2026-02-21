# Daily Dashboard

A beautiful, mobile-first personal dashboard with productivity widgets. Built with React, TypeScript, Vite, and Tailwind CSS.

## Widgets

1. **Daily Quote** - Inspirational quote that refreshes each day (API: quotable.io, fallback to local array)
2. **Inbox Zero** - Quick capture → graduate to tasks or delete (inline editing)
3. **Today's Tasks** - Checklist with completion tracking (inline editing)
4. **Shopping List** - Grocery list with quick-add categories, quantity prefixes, and configurable default template (inline editing, Config mode)
5. **Pomodoro Session** - Simple (25+5 min cycles) or Session (4x work + breaks) mode, configurable durations, fullscreen focus view
6. **BTC Price** - Live Bitcoin price (EUR), manual refresh, shows % change vs previous day
7. **Stock Price** - Multiple stock tracking, manual refresh, shows % change vs previous day, dynamic currency, horizontal slider for navigation, config mode for managing stock list
8. **Tetris** - Fully playable Tetris with tap controls, fullscreen mode with Give Up button, high score tracking

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- PWA (vite-plugin-pwa)
- localStorage (no backend)

## Features

### Mode Toggle
Three view modes controlled via the button in the footer (cycles: ○ → ◐ → ◉):

- **Regular (○)** - Full widget with title, content, and footer
- **Minimal (◐)** - Content only, reduced padding for maximum screen space
- **Config (◉)** - Full widget with additional config content, WidgetPairs stack vertically for more space

State is persisted in localStorage.

Some widgets support config mode with additional settings (e.g., Stock Price allows adding/removing stocks).

### Fullscreen Mode
Some widgets support fullscreen mode for a distraction-free experience. Currently supported by:
- **Pomodoro Session** - Focus view with circular progress timer, click to pause/resume
- **Tetris** - Immersive gameplay

To enter fullscreen, click the expand icon in the widget header. Press Escape or click the collapse icon to exit.

## Architecture

### Data Storage
All data persisted in localStorage:
- `daily-dashboard-mode` - Current view mode (regular/minimal/config)
- `daily-dashboard-quote` / `daily-dashboard-quote-date`
- `daily-dashboard-pomodoro`
- `daily-dashboard-inbox`
- `daily-dashboard-tasks`
- `daily-dashboard-shopping`
- `daily-dashboard-shopping-defaults` - Default template items for Shopping List
- `daily-dashboard-finance`
- `daily-dashboard-stock`

### Project Structure
```
src/
├── components/
│   ├── widgets/
│   │   ├── DailyQuote.tsx
│   │   ├── Pomodoro.tsx
│   │   ├── InboxZero.tsx
│   │   ├── TasksToday.tsx
│   │   ├── ShoppingList.tsx
│   │   ├── BTCPrice.tsx
│   │   ├── StockPrice.tsx
│   │   └── Tetris.tsx
│   ├── Layout.tsx
│   ├── WidgetContainer.tsx
│   └── WidgetPair.tsx
├── hooks/
│   ├── useLocalStorage.ts
│   └── useMode.tsx
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx
```

### TypeScript Types (src/types/index.ts)
- `Quote` - text, author
- `PomodoroSession` - id, duration (min), remaining (sec), isRunning, isBreak, sessionsCompleted, mode, workDuration, breakDuration, totalSessions
- `InboxItem` - id, text, createdAt
- `Task` - id, text, completed, createdAt
- `ShoppingItem` - id, text, completed, createdAt
- `FinanceData` - btcPrice, previousPrice, lastUpdated
- `StockData` - ticker, stockPrice, previousPrice, lastUpdated, companyName, currency
- `StockList` - stocks (array), activeIndex

## Issues

### CORS Issues with Public APIs
When deploying to GitHub Pages (or any domain), some public APIs may block requests due to CORS policies. For example, `api.quotable.io` may block requests from GitHub Pages domains. The app includes:
- **Timeouts** - Requests that hang for >5s will fall back to cached/local data
- **Fallback quotes** - Daily Quote widget has a local array of fallback quotes
- **Manual refresh** - Finance widget requires manual refresh (no auto-refresh)

If an API becomes unavailable or blocked, the widget will display cached data or fall back gracefully.

## Future Ideas

### Widgets
- [ ] Add more widgets (Daily Focus/Intention, Habit Tracker, Calendar, Notes)
- [ ] Make widgets reorderable (drag-and-drop vs. up/down arrows)
- [ ] Allow enabling/disabling widgets

### Daily Quote
- [ ] Find other API (api.quotable.io often unavailable)
- [ ] Refresh on clicking on the quote itself (works as button)
- [ ] Consolidate `daily-dashboard-quote` and `daily-dashboard-quote-date` into single key

### Inbox & Tasks
- [ ] Task categories/tags
- [ ] Priority levels
- [ ] Due dates
- [ ] Recurring tasks

### BTC & Stock Price
- [ ] Add price alerts (notify when price crosses threshold)
- [ ] Add latest news on BTC or stock

### Shopping List
- [ ] Allow reordering items (drag-and-drop)

### Tetris
- [ ] Show next piece preview
- [ ] Ghost piece (where piece will land)
- [ ] Pause feature (where to add action in UI?)
- [ ] Standard Tetris scoring (100/300/500/800 for 1/2/3/4 lines)
- [ ] Rotate counter-clockwise

### Messages
- [ ] Create simple widget to display messages to the user
- [ ] Integrated within the Daily Dashboard app (can listen to other widgets)
- [ ] Examples: "BTC price updated at ...", "API ... is down", "Price alert for ..."

### Data
- [ ] Export/Import data (JSON)
- [ ] Cloud sync (Firebase/Supabase) for cross-device
- [ ] Data backup

### UI/UX
- [ ] Dark/Light mode toggle (currently system-only)
- [ ] Widget animations
- [ ] Keyboard shortcuts

### Other
- [ ] Coin flip - Binary decisions (do X or Y?)
- [ ] Dice roll - Random selection (which task first?)
- [ ] Random number - Pick from a range

## PWA Installation

This app is a Progressive Web App and can be installed on your device:

### iPhone (Safari)
1. Open https://mageise.github.io/gtd-any/ in Safari
2. Tap the Share button (📤)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open https://mageise.github.io/gtd-any/ in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"
4. Tap "Install"
