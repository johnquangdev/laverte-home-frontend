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
| `/admin/login` | Google OAuth |
| `/admin/auth/callback` | OAuth callback |
| `/admin/bookings` | Admin schedule |
| `/admin/overview` | Revenue overview |

## Env

| Variable | Used by | Default |
|----------|---------|---------|
| `API_ROOT` | Server `httpClient` → Go backend | `http://localhost:14000/api/v1` |
| `NEXT_PUBLIC_API_ROOT` | Client direct calls (rare) | same |
| `NEXT_PUBLIC_APP_URL` | OAuth redirect base | `http://localhost:3000` |

Backend must set `GOOGLE_REDIRECT_URI=http://localhost:3000/admin/auth/callback`.

## Commands

```bash
pnpm install
pnpm dev      # :3000
pnpm build
pnpm lint
```
