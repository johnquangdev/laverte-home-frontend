const currency = new Intl.NumberFormat("vi-VN");
const dateContainer = document.querySelector("[data-dates]");
const timeContainer = document.querySelector("[data-times]");
const durationButtons = [...document.querySelectorAll("[data-hours]")];
const rangeText = document.querySelector("[data-range]");
const roomPriceText = document.querySelector("[data-room-price]");
const totalText = document.querySelector("[data-total]");
const mobileTotal = document.querySelector("[data-mobile-total]");
const bookingCard = document.querySelector(".booking-card");

const state = {
  dateOffset: 0,
  start: "14:00",
  hours: 6,
  price: 699000,
};

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const blockedByDay = [
  ["10:00", "12:00", "20:00"],
  ["08:00", "16:00", "18:00"],
  ["12:00", "14:00"],
  ["10:00", "18:00"],
  ["08:00", "20:00"],
];
const times = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

function isUnavailable(time) {
  const startHour = Number(time.slice(0, 2));
  return blockedByDay[state.dateOffset].some((blockedTime) => {
    const blockedHour = Number(blockedTime.slice(0, 2));
    return blockedHour >= startHour && blockedHour < startHour + state.hours;
  });
}

function getDate(offset) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

function renderDates() {
  dateContainer.innerHTML = "";
  for (let offset = 0; offset < 5; offset += 1) {
    const date = getDate(offset);
    const button = document.createElement("button");
    button.type = "button";
    button.className = offset === state.dateOffset ? "selected" : "";
    button.setAttribute("aria-pressed", String(offset === state.dateOffset));
    button.innerHTML = `<span>${offset === 0 ? "Hôm nay" : dayNames[date.getDay()]}</span><strong>${date.getDate()}</strong><small>Thg ${date.getMonth() + 1}</small>`;
    button.setAttribute("aria-label", `${offset === 0 ? "Hôm nay" : dayNames[date.getDay()]} ngày ${date.getDate()} tháng ${date.getMonth() + 1}`);
    button.addEventListener("click", () => {
      state.dateOffset = offset;
      const available = times.find((time) => !isUnavailable(time));
      if (isUnavailable(state.start)) state.start = available;
      renderDates();
      renderTimes();
      updateSummary();
    });
    dateContainer.appendChild(button);
  }
}

function renderTimes() {
  timeContainer.innerHTML = "";
  times.forEach((time) => {
    const button = document.createElement("button");
    const blocked = isUnavailable(time);
    button.type = "button";
    button.textContent = time;
    button.disabled = blocked;
    button.className = time === state.start ? "selected" : "";
    button.setAttribute("aria-pressed", String(time === state.start));
    button.setAttribute("aria-label", blocked ? `${time} không còn đủ thời lượng cho gói đã chọn` : `Bắt đầu lúc ${time}`);
    button.addEventListener("click", () => {
      state.start = time;
      renderTimes();
      updateSummary();
    });
    timeContainer.appendChild(button);
  });
}

function endTime(start, hours) {
  const [hour, minute] = start.split(":").map(Number);
  const total = hour + hours;
  const suffix = total >= 24 ? " hôm sau" : "";
  return `${String(total % 24).padStart(2, "0")}:${String(minute).padStart(2, "0")}${suffix}`;
}

function updateSummary() {
  const date = getDate(state.dateOffset);
  const label = state.dateOffset === 0 ? "Hôm nay" : `${dayNames[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  rangeText.textContent = `${label} · ${state.start} – ${endTime(state.start, state.hours)}`;
  roomPriceText.textContent = `${currency.format(state.price)}đ`;
  totalText.textContent = `${currency.format(state.price)}đ`;
  mobileTotal.textContent = `${currency.format(state.price)}đ`;
  document.querySelector("[data-summary] div:nth-child(2) span").textContent = `Gói ${state.hours} giờ`;
}

durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    durationButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.hours = Number(button.dataset.hours);
    state.price = Number(button.dataset.price);
    if (isUnavailable(state.start)) state.start = times.find((time) => !isUnavailable(time));
    renderTimes();
    updateSummary();
  });
});

const images = [
  { src: "./public/images/nest-1-bedroom.jpg", alt: "Phòng ngủ ấm cúng tại La Verte Nest 1" },
  { src: "./public/images/nest-1-wide.jpg", alt: "Không gian phòng khách và bàn ăn" },
  { src: "./public/images/nest-1-lounge.jpg", alt: "Góc xem phim riêng tư" },
  { src: "./public/images/nest-1-kitchen.jpg", alt: "Khu bếp riêng đầy đủ tiện nghi" },
  { src: "./public/images/nest-1-welcome.jpg", alt: "Nước uống và đồ ăn nhẹ chào đón" },
];
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCount = document.querySelector("[data-lightbox-count]");
let imageIndex = 0;

function showImage(index) {
  imageIndex = (index + images.length) % images.length;
  lightboxImage.src = images[imageIndex].src;
  lightboxImage.alt = images[imageIndex].alt;
  lightboxCount.textContent = `${imageIndex + 1} / ${images.length}`;
}

function openLightbox(index = 0) {
  showImage(index);
  lightbox.showModal();
}

document.querySelectorAll("[data-gallery-index]").forEach((button) => button.addEventListener("click", () => openLightbox(Number(button.dataset.galleryIndex))));
document.querySelector("[data-view-all]").addEventListener("click", () => openLightbox(0));
document.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
document.querySelector("[data-lightbox-prev]").addEventListener("click", () => showImage(imageIndex - 1));
document.querySelector("[data-lightbox-next]").addEventListener("click", () => showImage(imageIndex + 1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });

const confirmDialog = document.querySelector("[data-confirm]");
function showConfirmation() {
  document.querySelector("[data-confirm-text]").textContent = `Nest 1 · ${rangeText.textContent} · ${state.hours} giờ · ${currency.format(state.price)}đ.`;
  confirmDialog.showModal();
}
document.querySelector("[data-reserve]").addEventListener("click", showConfirmation);
document.querySelectorAll("[data-confirm-close]").forEach((button) => button.addEventListener("click", () => confirmDialog.close()));

document.querySelector("[data-mobile-reserve]").addEventListener("click", () => bookingCard.scrollIntoView({ behavior: "smooth", block: "start" }));
document.querySelector("[data-favorite]").addEventListener("click", (event) => {
  event.currentTarget.classList.toggle("active");
  event.currentTarget.textContent = event.currentTarget.classList.contains("active") ? "♥ Đã lưu" : "♡ Lưu lại";
});
document.querySelector("[data-share]").addEventListener("click", async () => {
  if (navigator.share) await navigator.share({ title: document.title, url: location.href });
  else await navigator.clipboard.writeText(location.href);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) return;
  if (event.key === "ArrowLeft") showImage(imageIndex - 1);
  if (event.key === "ArrowRight") showImage(imageIndex + 1);
});

renderDates();
renderTimes();
updateSummary();
