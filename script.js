/* William Palomino — V5 interactions
   Motion honors prefers-reduced-motion: everything degrades to static. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Smooth scroll (Lenis) ----------
let lenis = null;
if (window.Lenis && !reduceMotion) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// ---------- Anchor links ----------
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
});

// ---------- Mobile menu ----------
const burger = document.getElementById("navBurger");
const overlay = document.getElementById("menuOverlay");
if (burger && overlay) {
  const setMenu = (open) => {
    overlay.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!overlay.classList.contains("is-open")));
  overlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

// ---------- Nav state past the hero (IntersectionObserver, no scroll listener) ----------
const nav = document.getElementById("nav");
const hero = document.querySelector(".hero");
if (nav && hero && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    ([entry]) => {
      const pastHero = !entry.isIntersecting;
      nav.classList.toggle("is-scrolled", pastHero);
      if (burger) burger.classList.toggle("is-dark", pastHero);
    },
    { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
  );
  io.observe(hero);
}

// ---------- Scroll reveals ----------
if (window.gsap && window.ScrollTrigger && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onComplete: () => el.classList.add("is-visible"),
    });
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

// ---------- Videos: pause when off-screen, respect reduced motion ----------
document.querySelectorAll("video[autoplay]").forEach((v) => {
  if (reduceMotion) {
    v.removeAttribute("autoplay");
    v.pause();
    return;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.1 }
    ).observe(v);
  }
});
