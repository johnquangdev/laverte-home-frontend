# laverte-home-frontend

Next.js frontend for the La Verte homestay booking platform. Forked from the **stark-frontend** architecture.

## Stack

- Next.js 16 App Router (SSR)
- React 19 + React Compiler
- Tailwind CSS v4
- TanStack Query + Zustand
- BFF pattern: browser → `/api/*` (Next route handlers) → Go backend (`laverte-home`)

## Conventions (from stark-frontend)

- Path alias `@/*` → `src/*` — no `../` relative imports
- Atomic design: `components/atoms`, `molecules`, `organisms`, `ui`
- Named exports `export const X: FC<Props>` — default export only for Next pages/layouts
- kebab-case file names
- pnpm only (`packageManager` field enforced)

## Domain routes

| Route | Purpose |
|-------|---------|
| `/` | Guest landing |
| `/book` | Booking form + VietQR |
| `/admin` | Redirects to `/admin/bookings` |
| `/admin/login` | Google OAuth (username/password form only when `NEXT_PUBLIC_DEV_PASSWORD_LOGIN=true`, local dev) |
| `/admin/auth/callback` | OAuth callback |
| `/admin/bookings` | Daily schedule, lifecycle actions, door codes, walk-in bookings |
| `/admin/overview` | Revenue, occupancy, booking mix, per-room share |
| `/admin/rooms`, `/admin/pricing`, `/admin/blocked-slots` | Rooms, price rules, blocked windows |
| `/admin/payments` | Payments, QR re-send, refunds, transfer reconciliation |
| `/admin/sepay`, `/admin/settings` | Read-only view of the backend's effective config |
| `/admin/admins` | Admin roster (superadmin only) |

This is the **only** admin UI. The former `laverte-home-cms` (cms.laverte.vn)
and the Vite app under `laverte-core/web` are retired; cms.laverte.vn redirects
to `/admin` via a Traefik router in `docker-compose.production.yml`. Add new
admin screens here.

## Env

| Variable | Used by | Default |
|----------|---------|---------|
| `API_ROOT` | BFF proxy (`src/app/api/[...path]`) → Go backend | `http://localhost:14000/api/v1` |
| `NEXT_PUBLIC_API_ROOT` | Client direct calls (rare) | same |
| `NEXT_PUBLIC_APP_URL` | OAuth redirect base | `http://localhost:3000` |

Backend must set `GOOGLE_REDIRECT_URI` to this app's callback —
`http://localhost:3000/admin/auth/callback` locally,
`https://dev.laverte.vn/admin/auth/callback` in production. It accepts exactly
one value, which is why there can only be one admin UI.

## Commands

```bash
pnpm install
pnpm dev      # :3000
pnpm build
pnpm lint
```
