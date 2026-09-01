/* William Palomino — interactions */

// ---------- Preloader ----------
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("is-done"), 700);
  setTimeout(() => (pre.style.display = "none"), 1600);
});

// ---------- Smooth scroll (Lenis) ----------
let lenis = null;
if (window.Lenis) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Anchor links through Lenis
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: "smooth" });
  });
});

// ---------- Scroll animations (GSAP) ----------
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal elements
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // Hero portrait subtle parallax
  gsap.to(".hero__portrait img", {
    yPercent: 12,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // Marquee slows/shifts on scroll
  gsap.to(".hero__marquee-track", {
    xPercent: -8,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // Stat counters
  document.querySelectorAll(".stat__number").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
    });
  });
} else {
  // Fallback: show everything
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  document.querySelectorAll(".stat__number").forEach((el) => (el.textContent = el.dataset.count));
}

// ---------- Magnetic buttons ----------
document.querySelectorAll(".magnetic").forEach((el) => {
  const strength = 22;
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${(x / r.width) * strength}px, ${(y / r.height) * strength}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "translate(0, 0)";
    setTimeout(() => (el.style.transition = ""), 400);
  });
});
