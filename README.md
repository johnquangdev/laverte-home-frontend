# laverte-home-frontend

Next.js 16 frontend cho [laverte-home](https://github.com/johnquangdev/laverte-home) — homestay booking theo giờ / qua đêm / theo ngày.

Scaffold theo kiến trúc **stark-frontend**: App Router, BFF (`/api/*` → Go backend), TanStack Query, Zustand auth store, atomic design components, pnpm, Docker SSR.

## Yêu cầu

- Node 20+
- pnpm 9+
- Backend `laverte-home` chạy tại `:14000`

## Chạy local

```bash
cp .env.example .env
pnpm install
pnpm dev
```

Mở http://localhost:3000

### Backend cần cấu hình

```env
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000
GOOGLE_REDIRECT_URI=http://localhost:3000/admin/auth/callback
```

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `pnpm dev` | Dev server (:3000) |
| `pnpm build` | Production build |
| `pnpm start` | Chạy build |
| `pnpm lint` | ESLint + fix |

## Cấu trúc

```
src/
├── app/                 # App Router + BFF route handlers
│   ├── (default)/       # Guest: home, đặt phòng
│   ├── (admin-auth)/    # Login Google + callback
│   └── (admin)/         # Admin shell: bookings, overview
├── components/          # atoms / molecules / organisms / ui
├── hooks/               # queries + mutations
├── lib/axios.ts         # Client → /api BFF
├── stores/auth.ts       # JWT session (Zustand persist)
├── utils/http-client.ts # Server → Go backend
└── types/api/           # DTOs + entities
```

## Docker

```bash
docker build -t laverte-home-frontend .
docker run -p 3000:3000 \
  -e API_ROOT=http://host.docker.internal:14000/api/v1 \
  -e NEXT_PUBLIC_API_ROOT=http://host.docker.internal:14000/api/v1 \
  laverte-home-frontend
```

Health check: `GET /api/health`

## Routes

| URL | Màn hình |
|-----|----------|
| `/` | Landing |
| `/book`, `/dat-phong` | Đặt phòng + VietQR |
| `/admin/login` | Google OAuth admin |
| `/admin/bookings` | Lịch booking |
| `/admin/overview` | Doanh thu |

## Bản giao diện HTML gốc

Bản giao diện gốc nằm ở các file `index.html`, `booking.html`, `src/main.js`, `src/booking.js` và các file CSS/ảnh đi kèm. Chạy bằng:

```bash
pnpm dev:legacy
```

Sau đó mở http://localhost:5178
