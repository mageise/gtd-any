# Daily Dashboard

A beautiful, mobile-first personal dashboard with productivity widgets. Built with React, TypeScript, Vite, and Tailwind CSS.

## Widgets

1. **Daily Quote** - Inspirational quote that refreshes each day (API: quotable.io, fallback to local array)
2. **Inbox Zero** - Quick capture → graduate to tasks or delete (inline editing)
3. **Today's Tasks** - Checklist with completion tracking (inline editing)
4. **Shopping List** - Grocery list with quick-add categories and quantity prefixes (inline editing)
5. **Time Blocks** - 3 preset time blocks with Pomodoro-style timers (editable titles)
6. **BTC Price** - Live Bitcoin price (EUR), manual refresh, shows change vs previous day
7. **Stock Price** - Cloudflare stock price (EUR), manual refresh, shows change vs previous day
8. **Tetris** - Fully playable Tetris with tap controls, 5-min limit, high score tracking

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- PWA (vite-plugin-pwa)
- localStorage (no backend)

## Features

### Minimal Mode
Toggle minimal mode via ◉ button in the footer. Hides widget titles and footers, reduces padding and spacing for maximum screen space. State is persisted in localStorage.

## Architecture

### Data Storage
All data persisted in localStorage:
- `daily-dashboard-quote` / `daily-dashboard-quote-date`
- `daily-dashboard-timeblocks`
- `daily-dashboard-inbox`
- `daily-dashboard-tasks`
- `daily-dashboard-shopping`
- `daily-dashboard-finance`
- `daily-dashboard-stock`

### Project Structure
```
src/
├── components/
│   ├── widgets/
│   │   ├── DailyQuote.tsx
│   │   ├── TimeBlocks.tsx
│   │   ├── InboxZero.tsx
│   │   ├── TasksToday.tsx
│   │   ├── ShoppingList.tsx
│   │   ├── BTCPrice.tsx
│   │   ├── StockPrice.tsx
│   │   └── Tetris.tsx
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
- `ShoppingItem` - id, text, completed, createdAt
- `FinanceData` - btcPrice, previousPrice, lastUpdated
- `StockData` - stockPrice, previousPrice, lastUpdated

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
- [ ] Make widgets reorderable (drag-and-drop)
- [ ] Allow enabling/disabling widgets
- [ ] Allow full screen mode for full + tall widgets (e.g. games)

### Daily Quote
- [ ] Find other API (api.quotable.io often unavailable)
- [ ] Refresh on clicking on the quote itself (works as button)

### Inbox & Tasks
- [ ] Task categories/tags
- [ ] Priority levels
- [ ] Due dates
- [ ] Recurring tasks

### Time Blocks
- [ ] Link Time Blocks to Tasks (auto-suggest related tasks when block starts)
- [ ] Add custom time blocks (not just presets)
- [ ] Break timer between blocks

### BTC & Stock Price
- [ ] Make currency configurable (defaults to EUR)
- [ ] Add price alerts (notify when price crosses threshold)

### Mini Games
Quick brain breaks without leaving the app. Productivity-boosting for quick mental resets or decision making.

#### Tetris
- [ ] Show next piece preview
- [ ] Ghost piece (where piece will land)
- [ ] Pause feature (ESC key)
- [ ] Hard drop: add key "Space" for desktop
- [ ] Standard Tetris scoring (100/300/500/800 for 1/2/3/4 lines)
- [ ] Rotate counter-clockwise

#### Other Games
- [ ] Coin flip - Binary decisions (do X or Y?)
- [ ] Dice roll - Random selection (which task first?)
- [ ] Random number - Pick from a range

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
