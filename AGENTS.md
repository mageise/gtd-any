# AGENTS.md - Developer Guidelines

This document provides guidelines for agentic coding agents operating in this repository.

---

## 1. Development Workflow Protocol

Rule: Never commit/push without permission

### Standard Workflow

1. **Plan** - Present feature plan with:
   - Brief description (1-2 sentences)
   - Todo list of specific changes
   - Files affected

   Iterate with user if needed (1-2 rounds, or more if necessary)

2. **Implement** - Write code following the plan

3. **Verify** - Run pre-commit checks:
   ```bash
   npm run build
   npm run lint
   ```

4. **Present** - Show completed work to user

5. **Address Feedback** - Fix any issues if found

6. **Request Commit** - Ask "Should I commit?" with draft message (50/72 rule):
   - First line: max 50 chars, summary of what/why
   - Blank line
   - Body: max 72 chars per line, detailed explanation

   Example:
   ```
   add fetch timeout to DailyQuote widget

   prevents UI from hanging when quotable.io is unavailable.
   falls back to local quotes after 5 second timeout.
   ```

7. **Request Deploy** - After commit, ask "Should I push to deploy?"

### Speed-Path for Small Fixes

For trivial fixes (typos, minor bug fixes):
- Plan → Implement → Verify → Commit → Deploy

Skip the full presentation/feedback loop for obvious fixes.

---

## 2. Build, Lint, and Test Commands

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

### Running a Single Test

This project currently has **no test suite**. If tests are added in the future:
- Use `npm test -- --run` to run tests once (based on fin-track workflow)
- Use `npm test` for watch mode

### Pre-Commit Checks

Before committing, always run:
```bash
npm run build
npm run lint
```

---

## 3. Code Style Guidelines

### General Principles

- **Be concise**: Write minimal, focused code that solves the problem
- **Be consistent**: Follow existing patterns in the codebase
- **Be clear**: Prioritize readability over cleverness

### TypeScript

- **Always use TypeScript types** - Never use `any` unless absolutely necessary
- **Use explicit types** for function parameters and return types
- **Use type imports** for type-only imports: `import type { Task } from '...'`
- **Avoid implicit `any`** in callbacks - always annotate: `(prev: Task[]) => ...`

### Imports

**Order (recommended):**
1. React imports (`react`)
2. External libraries
3. Internal components/hooks/types (`../` or `./`)
4. Type imports last

**Example:**
```typescript
import { useState, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Task } from '../../types';
```

### Component Structure

- **One component per file** - No multiple exports
- **Filename matches component name** - `TimeBlocks.tsx` contains `TimeBlocks`
- **Props interface in same file** - Define near the component
- **Use function components** - No class components

**Example:**
```typescript
interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

export function Widget({ title, children }: WidgetProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|-------------|---------|
| Components | PascalCase | `TimeBlocks`, `InboxZero` |
| Functions | camelCase | `handleAdd`, `formatTime` |
| Variables | camelCase | `inputValue`, `taskList` |
| Constants | SCREAMING_SNAKE_CASE | `TASKS_KEY`, `DEFAULT_BLOCKS` |
| Types/Interfaces | PascalCase | `Task`, `InboxItem` |
| Files | kebab-case | `use-local-storage.ts` |

### React Patterns

- **Use functional components** with hooks
- **Use `useCallback` for event handlers** passed to child components
- **Use `useEffect` for side effects** - include all dependencies in dependency array
- **Avoid inline object definitions** in JSX props - define outside component or use inline primitives
- **Prefer composition over props drilling** - consider context if needed

### Error Handling

- **Use try-catch for async operations** - especially localStorage and API calls
- **Provide fallback values** - e.g., `localStorage` parsing with fallback to empty array
- **Handle API errors gracefully** - show user-friendly error messages
- **Never swallow errors silently** - at minimum log to console

### localStorage Patterns

When using localStorage:
- **Always wrap in try-catch** - localStorage can throw (quota exceeded, private browsing)
- **Parse safely** - check if item exists before parsing
- **Use type-safe wrapper** - like the `useLocalStorage` hook in this project

**Example:**
```typescript
const [value, setValue] = useLocalStorage<Task[]>('key', []);
```

### CSS / Tailwind

- **Use Tailwind CSS** - all styling via Tailwind classes
- **Use CSS variables for theming** - see `src/index.css`
- **Avoid arbitrary values** - use theme tokens when possible
- **Keep components scoped** - use specific class names if needed

### File Organization

```
src/
├── components/
│   ├── widgets/           # Widget components
│   │   ├── DailyQuote.tsx
│   │   ├── TimeBlocks.tsx
│   │   └── ...
│   ├── Layout.tsx
│   └── WidgetContainer.tsx
├── hooks/                 # Custom hooks
│   └── useLocalStorage.ts
├── types/                 # TypeScript types
│   └── index.ts
├── App.tsx
└── main.tsx
```

### Git Conventions

- **Use meaningful commit messages** - describe what changed and why
- **Squash related commits** - keep history clean
- **Push to master** - triggers GitHub Pages deployment

---

## 4. Project-Specific Guidelines

### Widget Development

When adding new widgets:
1. Create component in `src/components/widgets/`
2. Use `WidgetContainer` for consistent styling
3. Add localStorage persistence via `useLocalStorage` hook
4. Export as named component

### State Management

- **Local state** - Use `useState` for component-specific state
- **Shared state** - Lift to `App.tsx` and pass via props (current pattern)
- **Future** - Consider Context API if more complex sharing needed

### API Integration

- **Finance widget** - Uses CoinGecko API (no key required)
- **Quote widget** - Uses quotable.io with local fallback
- **Handle offline gracefully** - Always provide fallback/ cached data

### PWA Configuration

- Configured in `vite.config.ts` via `vite-plugin-pwa`
- Icons in `public/` folder (SVG format)
- Update manifest in vite config when adding features

---

## 5. Common Tasks Reference

### Adding a New Widget

1. Create `src/components/widgets/NewWidget.tsx`
2. Use `WidgetContainer` component
3. Add localStorage via `useLocalStorage` hook
4. Import and add to `App.tsx`
5. Add type definitions to `src/types/index.ts`

### Modifying Existing Widget

1. Find component in `src/components/widgets/`
2. Make changes following code style guidelines
3. Test locally with `npm run dev`
4. Run `npm run build` and `npm run lint` before committing

### Debugging localStorage Issues

- Check browser DevTools → Application → Local Storage
- Use `console.log` to verify state changes
- Ensure `useLocalStorage` is used consistently (not direct localStorage)

---

## 6. Testing Guidelines

When tests are added:
- Use **Vitest** or **Jest** (check fin-track for pattern)
- Place tests alongside source files: `Widget.tsx` → `Widget.test.tsx`
- Follow AAA pattern: **Arrange, Act, Assert**
- Test user-facing behavior, not implementation details
