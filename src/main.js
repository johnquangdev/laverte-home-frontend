const header = document.querySelector("[data-header]");
const drawer = document.querySelector("[data-drawer]");
const openMenu = document.querySelector("[data-menu-open]");
const closeMenu = document.querySelector("[data-menu-close]");
const filterButtons = document.querySelectorAll("[data-filter]");
const cards = document.querySelectorAll("[data-location]");
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSlides = document.querySelectorAll("[data-hero-slide]");
const heroDots = document.querySelectorAll("[data-hero-dot]");

let activeHeroSlide = 0;
let heroTimer;

const showHeroSlide = (index) => {
  activeHeroSlide = index;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeHeroSlide);
  });

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeHeroSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
};

const startHeroSlider = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.clearInterval(heroTimer);
  heroTimer = window.setInterval(() => {
    showHeroSlide((activeHeroSlide + 1) % heroSlides.length);
  }, 5000);
};

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showHeroSlide(Number(dot.dataset.heroDot));
    startHeroSlider();
  });
});

heroSlider.addEventListener("mouseenter", () => window.clearInterval(heroTimer));
heroSlider.addEventListener("mouseleave", startHeroSlider);
startHeroSlider();

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

openMenu.addEventListener("click", () => {
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
});

closeMenu.addEventListener("click", () => {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
});

drawer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const location = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    cards.forEach((card) => {
      card.classList.toggle("is-hidden", card.dataset.location !== location);
    });
  });
});
