# CONTEXT.md — StockFlow Web

## Overview

React 18 SPA for multi-channel e-commerce inventory management. Indian e-commerce context (Meesho, Flipkart, Amazon).

## Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool + dev server |
| TypeScript | 5.4 strict | Type safety |
| Tailwind CSS | 4 | Styling (oklch color system) |
| shadcn/ui | new-york | Component library (22 components) |
| Redux Toolkit | 2.12 | State management |
| RTK Query | 2.12 | API data fetching |
| React Router | 7.18 | Client-side routing |
| next-themes | 0.4.6 | Light/dark mode |
| Sonner | 2.0.8 | Toast notifications |
| Lucide React | 1.40 | Icons |
| Vite Proxy | - | `/api` → `http://localhost:3000` |

## Directory Structure

```
src/
├── main.tsx                          # Entry point (Provider, ThemeProvider, RouterProvider, Toaster)
├── App.tsx                           # Legacy demo component (can be removed)
├── routes.tsx                        # Route definitions (createBrowserRouter)
├── index.css                         # Global styles, theme variables (oklch)
├── vite-env.d.ts                     # Vite type definitions
│
├── components/
│   ├── ui/                           # shadcn/ui components (22)
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   └── shared/                       # Custom reusable components
│       ├── index.ts                  # Barrel exports
│       ├── DataTable.tsx             # Generic table with sorting/loading
│       ├── StatCard.tsx              # Dashboard stat cards
│       ├── PageHeader.tsx            # Page title + action button
│       ├── EmptyState.tsx            # No data placeholder
│       ├── ErrorState.tsx            # Error display + retry
│       ├── LoadingSpinner.tsx        # Spinner + LoadingPage
│       ├── ConfirmDialog.tsx         # Destructive action confirmation
│       ├── FormField.tsx             # Input with label/error/hint
│       ├── Badge.tsx                 # Status badges (6 variants)
│       ├── RowActions.tsx            # Table row dropdown menu
│       ├── Sidebar.tsx               # Collapsible navigation
│       ├── Header.tsx                # Top bar (theme, notifications, user)
│       ├── ProtectedRoute.tsx        # Auth guard
│       ├── ThemeToggle.tsx           # Light/dark/system switch
│       └── ThemeProvider.tsx         # next-themes wrapper
│
├── layouts/
│   ├── AuthLayout.tsx                # Centered auth pages
│   └── DashboardLayout.tsx          # Sidebar + header layout
│
├── pages/
│   ├── NotFound.tsx                  # 404 page
│   ├── auth/
│   │   └── Login.tsx                 # Login form
│   └── dashboard/
│       ├── Dashboard.tsx             # Stats overview
│       └── Items.tsx                 # Items list table
│
├── store/                            # Redux Toolkit store
│   ├── index.ts                      # Barrel exports
│   ├── store.ts                      # configureStore
│   ├── hooks.ts                      # useAppDispatch, useAppSelector
│   ├── api.ts                        # RTK Query API (login, register, getMe, getItems)
│   ├── baseQuery.ts                  # fetchBaseQueryWithReauth
│   ├── authSlice.ts                  # Auth state + localStorage
│   └── appSlice.ts                   # UI state (sidebar)
│
└── lib/                              # Utilities
    ├── utils.ts                      # cn, formatCurrency, formatDate, formatNumber, truncate
    └── toast.ts                      # Centralized toast helper
```

## Routing

| Path | Component | Auth | Layout |
|------|-----------|------|--------|
| `/` | Login | No | AuthLayout |
| `/login` | Login | No | AuthLayout |
| `/dashboard` | Dashboard | Yes | DashboardLayout |
| `/dashboard/items` | Items | Yes | DashboardLayout |
| `*` | NotFound | No | - |

## Conventions

### Imports
```tsx
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Shared components
import { DataTable, StatCard, PageHeader } from '@/components/shared';

// Store
import { useAppDispatch, useAppSelector, useGetItemsQuery } from '@/store';
import { setTokens, setUser, logout } from '@/store';

// Utils
import { cn, formatCurrency, toastHelper } from '@/lib/utils';
// Note: toastHelper is from '@/lib/toast'
```

### Named Exports
All components use **named exports** (not default):
```tsx
// Correct
export function MyComponent() { ... }
import { MyComponent } from '@/components/shared';

// Wrong
export default function MyComponent() { ... }
import MyComponent from '@/components/shared';
```

### Tailwind Classes
```tsx
// Color tokens (theme-aware)
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="text-muted-foreground"
className="border-border"
className="text-destructive"

// Dark mode (automatic via class strategy)
className="dark:bg-muted"

// Responsive
className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"

// cn() utility for conditional classes
import { cn } from '@/lib/utils';
className={cn('base-class', condition && 'conditional-class')}
```

### Redux Store
```tsx
// Dispatch actions
const dispatch = useAppDispatch();
dispatch(setTokens({ accessToken, refreshToken }));
dispatch(setUser(user));
dispatch(logout());

// Read state
const user = useAppSelector((state) => state.auth.user);
const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

// RTK Query hooks
const { data, isLoading, error } = useGetItemsQuery();
const [login, { isLoading }] = useLoginMutation();
```

### Toast Notifications
```tsx
import { toastHelper } from '@/lib/toast';

toastHelper.success('Title', 'Message');
toastHelper.error(error);                    // Auto-extracts API error message
toastHelper.error(error, 'Fallback title');
toastHelper.warning('Title');
toastHelper.info('Title');
toastHelper.loading('Loading...');

// Promise toast
toastHelper.promise(asyncFn(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: (err) => getErrorMessage(err),
});

// Validation errors (API 400 with field errors)
toastHelper.validation(apiError);
```

## Reusable Component API

### DataTable
```tsx
<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', render: (v) => <Badge>{v}</Badge> },
  ]}
  data={items}
  loading={isLoading}
  sortBy="name"
  sortOrder="asc"
  onSort={(key) => handleSort(key)}
  onRowClick={(item) => navigate(`/items/${item.id}`)}
/>
```

### StatCard
```tsx
<StatCard
  title="Total Items"
  value={count}
  icon={Package}
  change="+12%"
  changeType="positive"
/>
```

### PageHeader
```tsx
<PageHeader
  title="Items"
  description="Manage your inventory"
  actionLabel="Add Item"
  onAction={() => setOpen(true)}
/>
```

### ConfirmDialog
```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete item?"
  description="This action cannot be undone."
  confirmLabel="Delete"
  variant="destructive"
  onConfirm={handleDelete}
  loading={isDeleting}
/>
```

## Theme System

- **Provider**: next-themes with `class` strategy
- **Colors**: oklch color system (light + dark)
- **Fonts**: Inter (variable weight) from Google Fonts
- **Toggle**: Dropdown in Header (Light/Dark/System)

### Color Tokens
```
background, foreground
card, card-foreground
popover, popover-foreground
primary, primary-foreground
secondary, secondary-foreground
muted, muted-foreground
accent, accent-foreground
destructive, destructive-foreground
border, input, ring
chart-1 through chart-5
sidebar, sidebar-foreground, sidebar-primary, sidebar-accent, sidebar-border
```

## API Integration

Base URL: `/api` (proxied to `http://localhost:3000`)

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/items` | List items |

### Auth Flow
1. Login → `accessToken` + `refreshToken` stored in Redux + localStorage
2. Every request includes `Authorization: Bearer <token>`
3. 401 → auto-refresh token → retry request
4. Refresh fails → logout → redirect to `/login`

## Scripts

```bash
pnpm dev          # Start dev server (port 5173)
pnpm build        # Build for production
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
pnpm format       # Prettier
```

## Adding New shadcn Component

```bash
pnpm dlx shadcn@latest add <component-name>
```

## Adding New Page

1. Create `src/pages/<section>/<Page>.tsx` with named export
2. Add route in `src/routes.tsx`
3. Use existing shared components (DataTable, PageHeader, etc.)
4. Add RTK Query endpoint in `src/store/api.ts` if needed
