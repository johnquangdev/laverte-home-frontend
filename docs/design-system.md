# La Verte — Design system

Nguồn sự thật của token là `src/styles/globals.css` (block `@theme inline`). File này giải
thích **tại sao** từng token có giá trị đó và anatomy của từng component, để làm design cho
web và app mobile mà không phải đọc lại toàn bộ code.

Hai palette tách rời, không dùng lẫn:

- **Site khách** — nâu/kem, đã có từ trước (`--color-primary`, `--color-secondary`, `--color-background-1`…)
- **Admin** — neutral xám/trắng, theo reference bên dưới

---

## Reference của admin

Figma: `Dashboard - Hotel Booking (Community)` — dashboard quản lý khách sạn.

Đo trực tiếp từ file (không suy từ ảnh):

| Thứ | Giá trị |
|---|---|
| Frame | 1512×982, fill `#F0F0F0`, radius 0 |
| Body text | Inter Medium 14 / line-height 20 / letter-spacing 0 |
| Fill pill trạng thái | color style tên `green/700` |
| Icon set | lucide |

**Không đọc được từ file:** hex của pill, viền, các bước xám. File community không có
local variable/style nào — `green/700` đến từ library đã link, Figma chỉ hiện tên. Bản copy
nằm trong Drafts của account khác account MCP, và Drafts trên plan Free không share edit
qua link được, nên cả `get_design_context` lẫn `get_variable_defs` đều trả
`don't have edit access`.

**Cách xử:** tên `green/700` là thang mặc định của Tailwind, và project đã chạy Tailwind v4
nên có sẵn đúng thang đó. Lấy hex từ Tailwind là dùng chính nguồn mà reference dùng, không
phải sample màu từ ảnh nén.

---

## Token admin

Định nghĩa ở `src/styles/globals.css`. Class name giữ nguyên khi đổi giá trị — đó là lý do
đặt token trước khi restyle.

### Surface

| Token | Class | Giá trị | Vì sao |
|---|---|---|---|
| `--color-admin-page` | `bg-admin-page` | `#F0F0F0` | Đo từ frame reference |
| `--color-admin-card` | `bg-admin-card` | `#FFFFFF` | Khối content và mọi card |
| `--color-admin-shell` | `bg-admin-shell` | — | Nền ngoài cùng; trong reference trùng `admin-page` |
| `--color-admin-sidebar` | `bg-admin-sidebar` | — | Reference: sidebar **không có fill riêng**, để nền page lộ qua |

### Viền

| Token | Dùng cho |
|---|---|
| `--color-admin-line` | Viền card, đường kẻ giữa các row bảng |
| `--color-admin-field` | Viền input, chip filter |

### Chữ

| Token | Dùng cho |
|---|---|
| `--color-admin-ink` | Tên khách, số liệu lớn, section heading |
| `--color-admin-body` | Header bảng, label, text phụ |

### Trạng thái

Pill trong reference là **viền + nền nhạt + chữ đậm cùng hue**, không phải nền đặc.

| Trạng thái booking | Hue | Token |
|---|---|---|
| Đã xác nhận / đã thu | green | `state-paid` + `state-paid-fg` |
| Đã check-in | purple | *(chưa có — cần thêm)* |
| Đã huỷ / thất bại | red | `danger` + `danger-fg` |
| Chờ thanh toán | amber | `state-pending` + `state-pending-fg` |
| Hết hạn | gray | `state-expired` + `state-expired-fg` |

Reference có 3 trạng thái (Confirmed / Checked-In / Cancelled). La Verte có 6 theo
`model.Booking`: `pending_payment`, `confirmed`, `cancelled`, `expired`, `completed`,
`no_show` — nên phải mở rộng thang màu, không map 1-1 được.

### Bo góc & control

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--radius-field` | 8px | Input, chip, nav item |
| `--radius-card` | 12px | Card, stat tile, bảng |
| `--radius-pill` | 9999px | Pill trạng thái, nút |
| `--spacing-control-sm` | 34px | Chip filter, nút phụ |
| `--spacing-control-md` | 40px | Input, nút trong toolbar |
| `--spacing-control-lg` | 44px | Nút chính — sàn touch target WCAG, cũng là `min-h-11` mà `Button` đang dùng |

### Font

| Vai trò | Font | Ghi chú |
|---|---|---|
| Admin | Montserrat | Reference dùng Inter; giữ Montserrat để không thêm font và đồng bộ với site khách. Ở 14/20 đọc tương đương. |
| Tiêu đề site khách | Playfair Display | Chỉ site khách. Admin dùng sans cho mọi cấp — reference không có serif nào. |

---

## Icon

Dùng `lucide-react` (đã có trong `package.json`) — trùng bộ icon của reference.
Không tự vẽ SVG inline nữa.

Cỡ: `--spacing-control-*` không áp cho icon. Dùng `size-4` (16), `size-[18px]`, `size-5` (20)
theo ngữ cảnh; icon trong nút cùng cỡ với line-height của label.

---

## Anatomy component

Rút từ cây layer của reference. Tên trong ngoặc là tên layer gốc.

### Sidebar

- Không có fill riêng, ăn nền `admin-page`
- Logo: ô vuông đen bo góc + 2 dòng chữ (tên / phụ đề)
- Workspace switcher: hộp trắng bo `radius-field`, có dot + tên + chevron lên-xuống
- Nav chia **nhóm có heading** (`Hotel Management`, `Guest Booking`, `Control Panel`) —
  heading là chữ đậm, không phải label mờ
- Item thường: icon + label, không nền
- Item active: nền trắng + **vạch màu dọc bên trái**

### Toolbar trên (`Search Filters Wrapper`)

- Breadcrumb: icon toggle panel, gạch dọc, `Home > Trang hiện tại`
- Hàng phải: icon phễu + hộp chọn khoảng ngày
- Hàng dưới: input search (icon kính lúp) + các **chip viền nét đứt có dấu +** + nút `View` bên phải

### Stat tile

- Card trắng, viền, `radius-card`
- Label xám ~15px
- Số lớn ~28px đậm
- Dòng delta: `+14.3%` xanh có mũi tên lên, `-8.1%` đỏ có mũi tên xuống

### Bảng (`Guest List Wrapper`)

- `Guest List Header Wrapper`: chữ xám, không nền đặc
- Mỗi row là `Guest Row Wrapper` → `Guest Row Column` → wrapper từng cell
- Cell 2 dòng: dòng trên đậm (tên khách / số phòng), dòng dưới xám nhỏ (mã booking / loại phòng)
- Có chip đếm người: nền xanh nhạt, icon người + số 2 chữ số (`04`)
- Cell cuối: pill trạng thái, rồi `lucide/ellipsis` làm menu hành động
- Row cách nhau bằng đường kẻ `admin-line`

---

## Còn thiếu, chưa dựng

Chưa tách thành component, hiện là markup rời trong từng màn:

- `Switch` — cần cho màn Cấu hình SePay
- `StatTile` — cần cho Doanh thu và Giao dịch
- `StatusPill` — dùng ở cả Lịch đặt phòng và Giao dịch
- `TableRow` / `TableHeader`
- `NavItem` (có state active + vạch trái)
- `FilterChip` (viền nét đứt)

Chưa có token: hue **purple** cho trạng thái check-in.

---

## Quyết định đã chốt

| Quyết định | Lý do |
|---|---|
| Admin dùng neutral, site khách giữ nâu | Hai vai khác nhau; trộn vào là mất cả hai |
| 1 mode, không làm dark mode | `globals.css` có block `prefers-color-scheme: dark` nhưng set lại **đúng giá trị light** — app không có dark mode thật |
| Spacing chuẩn hoá về 4/8/12/16/20/26/32 | Admin đang dùng lẫn 10/14/18/26 inline. Đây là **thu hẹp có chủ ý**, code phải sửa theo |
| Lấy hex từ Tailwind | Reference đặt tên theo thang Tailwind (`green/700`) và project đã chạy Tailwind v4 |
| Giữ Montserrat cho admin | Không thêm font chỉ để giống reference |
| Bỏ Figma làm nơi chứa design system | Plan Free giới hạn 3 page/file, không đủ cho 1 page/component. Token sống trong code thì không bao giờ lệch với app |

---

## Chart

Palette categorical (đã chạy `validate_palette.js`, không ước lượng bằng mắt):

| Slot | Hex | Dùng cho |
|---|---|---|
| 1 | `#4f46e5` | Series đầu tiên, donut, progress bar |
| 2 | `#f97316` | Series thứ hai |
| 3 | `#0d9488` | Series thứ ba |

Kết quả validator (surface sáng): PASS lightness band, PASS chroma floor,
PASS CVD separation (worst adjacent ΔE 12.5 protan), PASS normal-vision floor
(ΔE 29.2). Một WARN: `#f97316` contrast 2.73:1 so với nền — theo skill thì WARN này
**bắt buộc** phải bù bằng nhãn hiện rõ hoặc table view, nên mọi chart đều có legend,
direct label ở điểm cuối, và một `<table class="sr-only">` song song.

Luật đã áp:

- **Không bao giờ 2 trục y.** Hai đại lượng khác thang thì tách thành 2 chart —
  doanh thu và số booking là 2 chart cột riêng, không chồng lên một trục.
- Slot màu gán theo **thứ tự cố định**, không xoay vòng, không sinh màu thứ 4.
- Bar cho một đại lượng trên nhiều hạng mục danh nghĩa → **một màu cho mọi bar**,
  không tô đậm-dần-theo-lớn.
- Grid là hairline liền, không nét đứt. Line 2px. Marker chỉ ở điểm cuối.
- Stacked cách nhau bằng **khe 2px màu nền**, không viền.
- Một hàng filter duy nhất ở trên, không filter riêng trong từng card.
- Refetch thì giữ render cũ ở `opacity-60`, không nháy skeleton.
- Số lớn ở stat tile dùng **proportional figures**; `tabular-nums` chỉ cho cột số
  và tick trục.

## Component đã có

| Component | File | Ghi chú |
|---|---|---|
| `StatusPill` | `atoms/status-pill.tsx` | Map đủ 6 trạng thái booking; `BOOKING_STATUS` export kèm |
| `StatTile` | `atoms/stat-tile.tsx` | Có delta % kèm mũi tên lên/xuống |
| `AdminPageHeader` | `organisms/admin/admin-page-header.tsx` | Breadcrumb + slot actions |
| `AdminStubPanel` | `organisms/admin/admin-stub-panel.tsx` | Màn chưa dựng, liệt kê endpoint còn thiếu |
| `MonthlyBarChart` | `organisms/admin/monthly-bar-chart.tsx` | Cột dọc, hover tooltip, table twin |
| `ChartCard` `Legend` `LineChartPair` `Donut` `StackedBars` `ProgressList` `MiniCalendar` | `organisms/admin/charts.tsx` | |
| `Switch` | `atoms/switch.tsx` | `role="switch"`, nhãn nhìn thấy cũng là accessible name |
| `DropdownMenu` | `atoms/dropdown-menu.tsx` | Kebab menu: Escape, click ngoài, mũi tên lên/xuống, trả focus về trigger |
| `FilterChip` | `atoms/filter-chip.tsx` | Nét đứt khi chưa chọn, đặc khi đang lọc; multi-select có đếm |
| `Pagination` | `atoms/pagination.tsx` | Cửa sổ tối đa 5 số quanh trang hiện tại |
| `EmptyState` | `atoms/empty-state.tsx` | Icon tròn + tiêu đề + mô tả + action |
| `smoothPath` `compactVnd` `percentChange` | `utils/chart.ts` | Cardinal spline → cubic bézier |

`DropdownMenu` viết tay chứ không thêm `@radix-ui/react-dropdown-menu`: hợp đồng chỉ
có Escape, click ngoài, roving arrow key và trả focus. Cần submenu hay typeahead thì
mới đổi sang Radix.

## Dữ liệu mẫu

Panel nào chạy bằng số mẫu thì **phải** mang badge `dữ liệu mẫu` (`ChartCard` và
`MonthlyBarChart` đều có prop `sample`). Mảng mock để cố định, không dùng
`Math.random()` — random gây lệch hydration và làm chart nhảy mỗi lần render.

Trang Overview có công tắc **Dữ liệu mẫu** ở header, bật sẵn: DB còn trống nên số
thật toàn số 0, mà một màn đầy số 0 thì không nói được là màn có chạy đúng hay
không. Tắt công tắc là 4 thẻ trên cùng và 2 biểu đồ cột đọc số thật; các panel
chưa có endpoint thì luôn là số mẫu.

Số mẫu phải **đúng tầm thật** — quanh 200tr/tháng với ~120 booking, tức ~1,7tr mỗi
booking. Số mẫu vô lý làm người review đánh giá sai cả layout.
