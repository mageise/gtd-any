# Daily Dashboard

A beautiful, mobile-first personal dashboard with productivity widgets. Built with React, TypeScript, Vite, and Tailwind CSS.

## Widgets

1. **Daily Quote** - Inspirational quote that refreshes each day (API: quotable.io, fallback to local array)
2. **Inbox Zero** - Quick capture → graduate to tasks or delete (inline editing)
3. **Today's Tasks** - Checklist with completion tracking (inline editing)
4. **Time Blocks** - 3 preset time blocks with Pomodoro-style timers (editable titles)
5. **Finance** - Live BTC price (EUR), manual refresh only

## Tech Stack
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- PWA (vite-plugin-pwa)
- localStorage (no backend)

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

## Issues

### CORS Issues with Public APIs
When deploying to GitHub Pages (or any domain), some public APIs may block requests due to CORS policies. For example, `api.quotable.io` may block requests from GitHub Pages domains. The app includes:
- **Timeouts** - Requests that hang for >5s will fall back to cached/local data
- **Fallback quotes** - Daily Quote widget has a local array of fallback quotes
- **Manual refresh** - Finance widget requires manual refresh (no auto-refresh)

If an API becomes unavailable or blocked, the widget will display cached data or fall back gracefully.

## Future Ideas

### Widgets
- [ ] Add more widgets (Daily Focus/Intention, Habit Tracker, Weather, Calendar, Notes)
- [ ] Make widgets reorderable (drag-and-drop)
- [ ] Allow enabling/disabling widgets
- [ ] Widget settings/config (e.g. global title/footer toggle, widget spec compliance)

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

### Finance
- [x] Simplify widget: Remove "Refresh" button -> use BTC avatar instead, remove "Updated ..." text
- [ ] Multiple cryptocurrencies
- [ ] Price alerts
- [ ] Portfolio tracking (manual entry)

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
