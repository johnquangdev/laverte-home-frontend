# La Verte Mobile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved mobile design (≤ 768px) for `/` and `/book` while desktop stays pixel-identical.

**Architecture:** A parallel mobile component tree (`src/components/organisms/mobile/`) rendered next to the
existing desktop components; a CSS media query at 768px shows exactly one of them (`.lvm` mobile, `.lvd`
desktop). Data moves to one shared module; booking state moves to one hook both booking views use.
Styles are a scoped global stylesheet ported from the approved mockup's `ds.css`.

**Tech Stack:** Next 16 App Router, React 19 (+ React compiler), TanStack Query, dayjs, plain CSS, `next/font`, `node --test` (Node 22 type stripping) for pure logic, Playwright MCP for screenshots.

**Spec:** `docs/superpowers/specs/2026-11-06-mobile-redesign-design.md` — read it first. The approved mockups it
names (`.superpowers/brainstorm/2407-1793940495/content/home-mobile-v5.html`, `book.html`, `ds.css`, `ds.js`,
`data.js`) are the visual source of truth: port their markup/CSS/behaviour, don't re-invent them.

## Global Constraints

- Desktop (> 768px) renders exactly as before — verified by before/after 1440px screenshots of `/` and `/book`.
- Mobile/desktop choice is CSS only: `@media (max-width: 768px)`. No JS width checks, no `useMediaQuery`.
- Accent `#123c68`, pressed `#0b2f54`; ink `#222`; ash `#6a6a6a`; hairline `#ddd`; cloud `#f7f7f7`; error `#c13515`; hero sky `#25384f`.
- Copy is the live site's (hero.tsx, updates.tsx, residences.tsx, site-footer.tsx, site-header.tsx, booking-section.tsx, payment-card.tsx); new copy only where the spec gives it.
- Hotline `1900 2208` (tel `19002208`), email `hello@laverte.vn`.
- `ACTIVE_AREAS = ['bao-loc']` filters mobile only.
- Inputs ≥ 16px, targets ≥ 44px, `prefers-reduced-motion` disables all motion.
- Work on branch `feat/mobile-redesign` (push to `main` deploys). Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; re-read comments in `git diff --cached` before each commit (comments say why, never what).
- Do not touch the booted iPhone 17 simulator; any iOS Simulator check uses its own device by UDID.

## Review Focus

- `/book?stay=<unknown>` or a stay without `homeId` → header falls back sanely (unknown: fixed photo + API home name; unmapped: stay header, no preselect) — Task 5 checks both URLs.
- `expires_at` null or already in the past when the VietQR view opens → no timer / straight to "hết thời gian" — `holdSecondsLeft` tests in Task 2, screenshot in Task 5.
- Production `/homes` returns `[]` → mobile `/book` shows the existing empty copy and no live submit bar — Task 5 screenshot with `[]` mocked.
- Widths 769–1050 and exactly 768/769 → only one tree visible, no doubled header/footer — Task 6 screenshots at 768 and 769.
- Reduced motion → hero title and masked headings are visible without animating (their start state is hidden) — Task 4 checks with `emulateMedia({ reducedMotion: 'reduce' })`.

---

### Task 1: Shared stays data + desktop baseline

**Files:**
- Create: `src/constants/stays.ts`, `src/constants/stays.test.ts`
- Modify: `src/components/organisms/laverte/updates.tsx`, `src/components/organisms/laverte/residences.tsx` (read data from the module; markup untouched)
- Modify: `package.json` (`"test": "node --test src/**/*.test.ts"`), `tsconfig.json` (`"allowImportingTsExtensions": true`), `.gitignore` (`.superpowers/`, `.playwright-mcp/`)

**Interfaces:**
- Produces (from `src/constants/stays.ts`, no imports so `node --test` can load it):
  - `type AreaKey = "bao-loc" | "dong-xoai" | "long-khanh" | "da-lat"`
  - `type Area = { key: AreaKey; name: string; region: string; img: string; alt: string; desc: string }`
  - `type Stay = { key: string; area: AreaKey; name: string; price: string; img: string; alt: string; homeId?: number }` — `key` is a slug of the name (`"may-trang"`, `"the-nest"`, …), `price` keeps the live format `"149.000đ/h"`.
  - `AREAS: Area[]` (the 3 from updates.tsx), `AREA_FILTERS: { key: AreaKey; label: string }[]` (the 4 from residences.tsx), `STAYS: Stay[]` (all 24, same order/images/alts as residences.tsx)
  - `ACTIVE_AREAS: AreaKey[] = ["bao-loc"]`; `MOBILE_AREAS`, `MOBILE_FILTERS`, `MOBILE_STAYS` = the three lists filtered by it
  - `findStay(key: string | null | undefined): Stay | undefined`
  - `stayBookHref(stay: Stay): string` → `/book?stay=<key>` plus `&home=<homeId>` when set
  - `CONTACT = { hotline: "1900 2208", tel: "19002208", email: "hello@laverte.vn" }`

- [ ] **Step 1: Desktop baseline before any edit.** `npm run dev`; Playwright at 1440×900: full-page screenshots of `/` and `/book` → `.playwright-mcp/baseline-home-1440.png`, `baseline-book-1440.png`. Keep them for Task 6.
- [ ] **Step 2: Write the failing test** `src/constants/stays.test.ts` (`node:test` + `node:assert/strict`, import `./stays.ts`):
  - `STAYS.length === 24`, keys unique; `AREAS.length === 3`; `AREA_FILTERS.length === 4`
  - `MOBILE_STAYS.length === 6` and every `area === "bao-loc"`; `MOBILE_AREAS.map(a => a.key)` deep-equals `["bao-loc"]`
  - `stayBookHref(findStay("may-trang")!) === "/book?stay=may-trang"`; `stayBookHref({ ...findStay("may-trang")!, homeId: 3 }) === "/book?stay=may-trang&home=3"`
  - `findStay("nope") === undefined`, `findStay(null) === undefined`
- [ ] **Step 3:** `npm test` → FAIL (module missing).
- [ ] **Step 4:** Create `src/constants/stays.ts` per Interfaces; point `updates.tsx` / `residences.tsx` at `AREAS` / `AREA_FILTERS` / `STAYS` (map `area` where the component used `location`).
- [ ] **Step 5:** `npm test` → PASS; `npm run lint` → clean; desktop `/` screenshot at 1440 identical to baseline.
- [ ] **Step 6: Commit** `refactor(guest): move areas and stays into one shared module`

### Task 2: Booking time helpers + `useBookingForm`

**Files:**
- Create: `src/utils/booking-time.ts`, `src/utils/booking-time.test.ts`, `src/hooks/use-booking-form.ts`
- Modify: `src/components/organisms/booking/booking-section.tsx` (state/logic → hook; JSX unchanged)

**Interfaces:**
- Produces (`src/utils/booking-time.ts`, no imports):
  - `durationLabel(start: Date, end: Date): string` → whole hours as `"4 giờ"`; a whole multiple of 24h as `"2 ngày"`; `end <= start` → `"—"`
  - `holdSecondsLeft(expiresAt: string | null, nowMs: number): number | null` → `null` when `expiresAt` is null, else `max(0, round((expires − now)/1000))`
  - `formatHold(seconds: number): string` → `"mm:ss"` zero-padded
- Produces (`src/hooks/use-booking-form.ts`): `BOOKING_TYPES` (moved from booking-section.tsx) and
  `useBookingForm(defaultHomeId?: number)` returning everything booking-section.tsx uses today:
  `homesQuery, homeId, setHomeId, selectedHome, customerName, setCustomerName, customerPhone, setCustomerPhone, bookingType, setBookingType, startDate, setStartDate, startTime, setStartTime, endDate, setEndDate, endTime, setEndTime, start, end, availability, busy, clash, overlapError, createBooking, result, setResult, handleSubmit`. Behaviour (defaults today/14:00→18:00, first-home autoselect, clash guard + its exact message, payload) moves verbatim.

- [ ] **Step 1: Failing tests** `src/utils/booking-time.test.ts`:
  - `durationLabel(new Date("2026-11-06T14:00"), new Date("2026-11-06T18:00")) === "4 giờ"`; 14:00 → next day 14:00 `=== "1 ngày"`; 14:00 → 14:00 next-next day `=== "2 ngày"`; 18:00 → 14:00 `=== "—"`
  - `holdSecondsLeft(null, 0) === null`; `holdSecondsLeft("2026-11-06T10:15:00Z", Date.parse("2026-11-06T10:00:00Z")) === 900`; past expiry → `0`
  - `formatHold(898) === "14:58"`, `formatHold(0) === "00:00"`
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement `booking-time.ts`; extract `useBookingForm`; `BookingSection` becomes the same JSX reading from the hook.
- [ ] **Step 4:** `npm test` PASS; `npm run lint` clean; `/book` at 1440 identical to baseline.
- [ ] **Step 5: Commit** `refactor(booking): share booking form state through useBookingForm`

### Task 3: Mobile foundation — CSS, assets, chrome

**Files:**
- Create: `src/app/(default)/mobile.css`; `public/images/mobile/{aframe.jpg,aframe-house.webp,hotspot-1.jpg,hotspot-2.jpg,logo.png}` (copied from the mockup folder: `aframe.jpg`, `aframe-house.webp`, `w1.jpg`, `w2.jpg`, `logo.png`); `scripts/lift-subject.swift` (copy of the spec's `lift.swift`, header comment with usage)
- Create: `src/components/organisms/mobile/motion.ts`, `top-bar.tsx`, `footer.tsx`
- Modify: `src/app/(default)/layout.tsx`

**Interfaces:**
- Produces:
  - CSS contract: `.lvm` = mobile-only root (`display:none` > 768px), `.lvd` = desktop-only wrapper (`display: contents` > 768px, `none` ≤ 768px). Every mobile selector is nested under `.lvm` so nothing reaches `laverte.css` markup. `html.lvm-at-hero` (inside the 768 media query) paints `html, body` `#25384f`. Ports `ds.css` tokens/components: `.btn(-primary|-secondary)`, `.icon-btn`, `.glass`, `.eyebrow`, `.h-section`, `.h-sub`, `.body-ash`, `.mask`, `.reveal`, `.io`, `.topbar`, `.sheet`, `.reserve`, `.footer`, view-transition keyframes, `[id]{scroll-margin-top}`; all under the media query.
  - Display font: `next/font/google` `Manrope({ weight: "800", variable: "--font-lvm-display" })` in the (default) layout — a separate family so desktop's `Manrope` 800 rules keep rendering as they do now.
  - `motion.ts`: `useReveal(root: RefObject<HTMLElement | null>)` (adds `in` to `.reveal`/`.io` once intersecting, re-scans when called again via returned `rescan()`), `jumpTo(hash: string)` (view transition → instant `scrollIntoView`, plain jump under reduced motion or without the API).
  - `MobileTopBar` (client, no props): logo/`Chọn căn`/menu button, the sheet (links from `site-header.tsx` drawer + `Liên hệ`, `/`-prefixed so they work from `/book`; Hotline/email buttons), Escape + scroll lock, same-page `#` links routed through `jumpTo`. Watches the page for `[data-photo-top]` (transparent bar + white logo while it is under the bar) and `[data-hide-brand]` (logo hidden while visible).
  - `MobileFooter` (server): footer per spec, reads `CONTACT`, "Điểm đến" lists `MOBILE_FILTERS`.
- [ ] **Step 1:** Write `mobile.css` and the three components from the mockup; wire the layout: desktop `SiteHeader`, `SiteFooter`, `ChatButton` each wrapped in `<div className="lvd">`; `<MobileTopBar />` and `<MobileFooter />` inside `.lvm` roots; the font variable on the layout's wrapper.
- [ ] **Step 2:** `npm run lint` clean. Playwright 390×844 `/`: top bar + menu (open, ✕ in place, Escape closes) + footer render, no desktop header/footer visible. 1440: identical to baseline.
- [ ] **Step 3: Commit** `feat(mobile): design system, top bar, menu and footer for phones`

### Task 4: Mobile home

**Files:**
- Create: `src/components/organisms/mobile/home/{hero.tsx,stays.tsx,reserve-bar.tsx,index.tsx}`
- Modify: `src/app/(default)/page.tsx` (`<div className="lvd">…existing…</div>` + `<MobileHome />`)

**Interfaces:**
- Consumes: `MOBILE_STAYS`, `MOBILE_FILTERS`, `MOBILE_AREAS`, `stayBookHref`, `useReveal`, `jumpTo`.
- Produces: `MobileHome` (client). Section ids `intro`, `residences`, `membership`, `story` (menu links depend on them).

- [ ] **Step 1:** `MobileHero` — `data-photo-top data-hide-brand`, `100lvh`, layers bg → fog canvas → title → house cut-out, entrance (`l1` settle, `l2` emerge), hotspots + leads + dots, touch parallax via `--px/--py`, glass ↓ (`bottom: calc(100lvh - 100svh + 18px)`) jumping to `#intro`. Fog canvas: half-res, pauses off-screen, skipped under reduced motion. Reduced motion: start states become the end state.
- [ ] **Step 2:** `MobileStays` — tab row (hidden when `MOBILE_FILTERS.length < 2`), sticky stacking cards (`--i` offset 10px, height formula from the mockup), each card an `<a href={stayBookHref(stay)}>`; exposes `selectArea(key)` so "Khám phá ↗" in the place section selects an area before `jumpTo('#residences')`.
- [ ] **Step 3:** `MobileHome` composes hero, intro, stays, membership (hand-crop values from the spec), place (`MOBILE_AREAS`), `MobileReserveBar`. Hero visibility drives: reserve bar hidden over the hero, `html.lvm-at-hero` while the hero is on screen and `#intro` is not (cleared on unmount); footer CTA row visible → bar hidden (`visibility:hidden` when gone). Reserve bar line: `"Bảo Lộc · đặt theo giờ"` when one area, `"<n> khu vực · đặt theo giờ"` otherwise; "Đặt ngay" → `/book`.
- [ ] **Step 4:** Playwright 390×844 screenshots: hero (after entrance), intro, stays mid-stack, membership, place, footer; hero with reduced motion (title visible); `npm run lint` clean; 1440 `/` identical to baseline.
- [ ] **Step 5: Commit** `feat(mobile): home page — hero, stacking stays, couple and place sections`

### Task 5: Mobile booking

**Files:**
- Create: `src/components/organisms/mobile/booking/{index.tsx,payment.tsx}`
- Modify: `src/app/(default)/book/page.tsx` (also read `stay`; render `<div className="lvd"><BookingSection …/></div>` + `<MobileBooking defaultHomeId stayKey />`)

**Interfaces:**
- Consumes: `useBookingForm`, `BOOKING_TYPES`, `findStay`, `durationLabel`, `holdSecondsLeft`, `formatHold`, `formatVnd` (`src/utils/common.ts`).
- Produces: `MobileBooking({ defaultHomeId?: number; stayKey?: string })`, `MobilePayment({ booking: BookingEntity; onReset: () => void })`.

- [ ] **Step 1:** `MobileBooking` — `data-photo-top` header: stay photo/name/area/price when `findStay(stayKey)`, else `/images/home-hero.jpg` + selected API home name; white sheet; panel 1 (home select, type chips, 2×2 date/time cells with `durationLabel`, busy chips with clash in red), panel 2 (name `autocomplete="name"`, phone `type="tel" autocomplete="tel"`), inline errors with the hook's messages; fixed bottom bar (duration + range, "Tiếp tục thanh toán", spinner while pending, `form` attribute). Loading / error / empty `/homes` states use the existing copy and hide the bar. Selecting a home while a stay is shown keeps the stay header (it is the marketing face of the place).
- [ ] **Step 2:** `MobilePayment` — eyebrow, "Mã #id", `formatVnd(computed_price)`, QR `<img src={qr_content}>` (explicit size), scan sentence, hold chip ticking each second via `holdSecondsLeft(expires_at, Date.now())` → at `0` QR + chip hide and the line "Hết thời gian giữ chỗ. Vui lòng đặt lại để nhận mã mới." shows; `null` → no chip; facts (Khách, Thời gian, Hết hạn giữ chỗ); "Đặt phòng khác".
- [ ] **Step 3:** Playwright 390×844 with `page.route('**/api/homes*')`, `'**/api/homes/*/availability*'`, `'**/api/bookings'` mocked: `/book?stay=the-nest` form; clash error (busy 09:00–12:00, pick 10:00); VietQR view; VietQR with `expires_at` in the past; `/book?stay=nope`; `/homes` → `[]`. `npm run lint`; 1440 `/book` identical to baseline.
- [ ] **Step 4: Commit** `feat(mobile): booking page with VietQR hold timer`

### Task 6: Whole-branch verification

- [ ] **Step 1:** `npm test`, `npm run lint`, `npm run build` — all pass.
- [ ] **Step 2:** Playwright: 1440 screenshots of `/` and `/book` vs Task 1 baselines (pixel diff via `sips`/PIL — must be identical apart from the hero slider frame); 768 and 769 screenshots of `/` showing exactly one header and one footer.
- [ ] **Step 3:** iOS Safari check on a dedicated simulator (`xcrun simctl create "LV iPhone 16e" …`, target by UDID, never `booted`): status bar/toolbar tint over the hero, glass ↓, stacking cards, menu.
- [ ] **Step 4:** Fix anything found; commit `fix(mobile): …` per fix.
