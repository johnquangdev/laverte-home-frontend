# La Verte — mobile redesign (home + booking)

## Intent

laverte.vn on a phone today is the desktop landing squeezed down. The owner wants the
phone experience to feel like a premium travel product — the "Mountain Retreat" sample on
motionsites.ai for the opening moment, Airbnb's design system for everything after it —
so a guest on a phone gets from "wow" to a booked hour with as little friction as possible.

The approved design is the clickable mockup set (see *Reference*). This document is what a
builder needs alongside it.

## Scope

- Guest site route group `src/app/(default)`: the home page `/` and the booking page `/book`,
  plus the chrome they share (top bar, menu sheet, footer, bottom reserve bar).
- Screens **≤ 768px** only. Above that, every page renders exactly as it does today.

### Non-goals

- Any desktop/tablet (> 768px) change. A desktop design will come separately.
- Admin (`(admin)`, `(admin-auth)`).
- Pages behind the footer's dead links (`#`: Về chúng tôi, Chính sách…) — they stay `#`.
- A price estimate before the booking exists; the server's `computed_price` stays the only price shown for a booking.
- Animated transitions between routes (home → /book). Only in-page jumps animate.

### Anti-goals (a failure even if it "works")

- Desktop looks or behaves differently after this change.
- A hydration mismatch or layout flash from choosing mobile vs desktop in JS.
- The booking flow's rules change: same request payload, same overlap guard, same VietQR card data.

## Reference

Approved mockups (untracked, in this repo): `.superpowers/brainstorm/2407-1793940495/content/`

| File | What it is |
|---|---|
| `home-mobile-v5.html` | The approved home page |
| `book.html` | The approved booking page (form + VietQR state) |
| `ds.css` | The design system the two pages share |
| `ds.js` | Shared behaviour: menu, in-page view transitions, reveals, top-bar-over-photo |
| `data.js` | Areas/stays data and the `ACTIVE` area switch |
| `aframe.jpg`, `aframe-house.webp`, `w1.jpg`, `w2.jpg`, `logo.png` | Assets to bring into `public/` |

Earlier versions (`home-mobile-v3/v4`, `book-dark.html`, `ds-dark.css`) are rejected drafts — ignore them.
`.superpowers/` must be added to `.gitignore` in this change.

## Design system (decided)

Airbnb structure with La Verte's colour:

- White canvas `#fff`, ink `#222`, secondary text `#6a6a6a`, hairlines `#ddd`, soft cloud `#f7f7f7`, error `#c13515`.
- **One accent: navy `#123c68`** (pressed `#0b2f54`) — the brand navy from `laverte.css` and the logo — used only for primary buttons, the eyebrow labels and the hold-timer chip.
- Manrope everywhere (already the site font); body weight 500; the hero title uses 800 (layout must load 800).
- Radius 8px buttons, 14px photos/cards, 20px large photos and panels, 50% icon buttons.
- Panels use Airbnb's three-layer shadow; nothing else has a shadow except the sticky stay cards.
- **Liquid glass** (`.glass` in `ds.css`) only for controls floating over photography — currently the hero's ↓ button.
- No uppercase labels; text sits under photos, except the hero and the stacking stay cards, which the owner explicitly wants as photo-with-text.

## Home page, top to bottom (decided)

1. **Hero** — full viewport (`100lvh`, runs under Safari's floating toolbar). Night A-frame photo; the
   word "La Verte" sits *behind* the house: photo → mist/firefly canvas → title → house cut-out layer.
   "La" settles from a blur, "Verte" rises from behind the roof. Two white hotspot cards with drawn
   leader lines and pulsing dots ("Lưu trú riêng tư theo giờ", "Giá tiết kiệm — Từ 119.000đ/h tại Bảo Lộc").
   Touch parallax. Glass ↓ button lifted above the Safari toolbar. While the hero fills the screen the
   page background is `#25384f` so Safari tints its status bar and toolbar to match the sky
   (Safari ignores `theme-color` for this; it samples the page background and fixed bars at the edges).
2. **Intro** — copy from `hero.tsx`: "Ở một nơi đẹp, dành thời gian cho nhau." + paragraph; buttons
   "Chọn căn" (primary) and "Khám phá La Verte" (secondary).
3. **Chọn căn La Verte** — full-height photo cards that stick and stack while scrolling (each card sticks
   10px lower than the previous). Card: area badge, `01 / 06`, "La Verte" + big stay name rising from a mask,
   "Giá tiết kiệm" + price/giờ, white "Đặt ngay" → `/book`. An underline tab row filters by area, hidden
   while only one area is open. Card height keeps the bottom reserve bar off the card's button.
4. **Dành cho hai người** — couple banner hand-cropped to the couple (the banner bakes its headline into
   the upper left; the crop is x 760–1717, y 350–916 of 1717×916), then its words as live text, "Setup kỷ niệm".
5. **Nơi bạn sẽ đến** — eyebrow "Các khu vực triển khai"; per open area: 4:3 photo with region badge,
   "Bảo Lộc, Lâm Đồng", description, "Khám phá ↗" (jumps to the stays section with that area selected).
6. **Footer** — soft-cloud background: heading + line from `site-footer.tsx`, hairline rows for Hotline
   (`1900 2208 / Zalo OA`) and Email (`hello@laverte.vn`), "Gọi ngay" / "Liên hệ La Verte", social circles,
   the four link groups as accordions, copyright line.

Shared chrome:

- **Top bar** — logo left; "Chọn căn" pill + round menu button right. Transparent with a white logo while a
  photo is under it, white with a hairline and navy logo otherwise. On the home hero the logo hides (the
  title already says it).
- **Menu** — the same round button morphs into ✕ (never jumps sides); full-screen white sheet; links from
  `site-header.tsx` drawer + "Liên hệ"; Hotline/email buttons at the bottom. Escape closes; body scroll locks.
- **Reserve bar** — Airbnb bottom bar: "Từ 119.000đ / giờ" + area line, navy "Đặt ngay". Hidden over the hero
  and when the footer's call buttons are on screen; when hidden it is `visibility: hidden` (Safari samples it).
- **In-page jumps** (any `#anchor` link on the same page) use `document.startViewTransition` — old view
  fades/shrinks, new view rises — and fall back to an instant jump. Anchored sections land below the top bar.
- **Reveals**: headings rise out of a mask, blocks fade up, once, via IntersectionObserver.
- `prefers-reduced-motion` turns all of it off.

## Booking page `/book` (decided)

Same rules and data as today's `BookingSection` — only the presentation is new on mobile:

- Photo header (fixed photo: `/images/home-hero.jpg`, since API homes carry no image) with a white sheet
  overlapping it: selected home's name, category, "Đặt phòng" + the existing intro sentence.
- Panel 1: Phòng (select of `/homes`), Loại đặt (three equal chips), Thời gian (2×2 date/time cells,
  duration shown next to the label), "Khung giờ đã kín trong những ngày này" chips (a clash turns red).
- Panel 2: Họ tên, Số điện thoại; errors (clash, API error) inline with the exact existing wording.
- Bottom bar: duration + range, navy "Tiếp tục thanh toán".
- After create: VietQR view from `PaymentCard`'s data — "Mã #id", `computed_price`, QR from `qr_content`,
  a live "Giữ chỗ còn mm:ss" counting to `expires_at`, facts list, "Đặt phòng khác".
- **My call — hold expiry:** the backend's expiry job releases unpaid holds and its webhook rejects a late
  transfer (`BookingExpired`, refund by hand). So when the countdown hits 00:00 the mobile view hides the QR
  and says the hold has ended, with "Đặt phòng khác" as the action. No `expires_at` → no timer chip.
  Desktop `PaymentCard` is unchanged.
- Loading / API error / no homes states keep today's copy.

The mockup's room list and price math are illustrative; the real page uses the API.

## Data (decided)

- Areas and stays move from `updates.tsx` / `residences.tsx` into one shared module (desktop keeps
  rendering the full lists, pixel-identical). An `ACTIVE_AREAS = ['bao-loc']` switch filters **only the
  mobile** views — owner's decision: the desktop site still shows all four places until it is redesigned.
- Each stay gets an optional `homeId` (the API home it sells), empty for now — the marketing stays
  (Mây Trắng, Đồi Thông…) don't exist in the API yet and production `/homes` is empty. The owner will
  map them later.
- Contact values come from one place for the new components (hotline, email); the stale
  `src/constants/info.ts` placeholder is left alone.

### "Đặt ngay" on a stay → `/book` (owner's decision)

- The card links to `/book?stay=<stay key>` plus `&home=<homeId>` when the stay is mapped.
- Mobile `/book` shows the tapped stay's photo, name, area and price in its header.
- If the stay has a `homeId`, that API home is preselected; otherwise the guest picks from `/homes` as today.
- Opened without `stay` (reserve bar, top-bar "Chọn căn" → home, or a direct visit): fixed photo
  `/images/home-hero.jpg` and the selected API home's name.
- Desktop `/book` keeps reading only `home`, as today.

## Constraints

- Next 16 App Router, React 19 with the React compiler, Tailwind v4 present; the guest site styles with
  plain global CSS (`laverte.css`). ESLint runs with `--max-warnings=0`; husky/commitlint on commit.
- Push to `main` deploys to production — work stays on `feat/mobile-redesign`.
- Mobile/desktop switch is CSS-only (media query at 768px), never JS width checks.
- iOS: inputs ≥ 16px (no focus zoom), targets ≥ 44px, `viewport-fit=cover` already set.
- Hero assets are illustrative Unsplash photos (owner approved as temporary). The house cut-out is made
  with macOS Vision subject lifting; commit the small Swift script so a real photo can be cut the same way.
  The script that produced the current cut-out is
  `/private/tmp/claude-502/-Users-gunnguyen-sfastvn/8ace469e-db5f-45db-a6a5-a949be6acff3/scratchpad/cut/lift.swift`
  (`swift lift.swift in.jpg out.png`, then convert to webp) — copy it to `scripts/`.

## Left to the builder

- Component split and file names; how the shared mobile CSS is organised and scoped so it cannot leak into
  desktop selectors (`laverte.css` already uses `.hero`, `.badge`-like names).
- How booking state is shared between the desktop `BookingSection` markup and the mobile view (one hook is
  the obvious shape) — desktop markup must not change.
- Verification approach. Must include: `npm run lint`, `npm run build`, screenshots at 390×844 of each
  section and of `/book` (form, clash error, VietQR, expired hold), and 1440-wide screenshots of `/` and
  `/book` taken before and after the change, compared to show desktop unchanged. Any iOS Simulator check uses its own device by UDID — never the booted iPhone 17,
  which other sessions use.
