// reveal.js
// One-time fade/slide-up as an element with the .reveal class enters the
// viewport. Used on the cover page's marketing sections only — this is a
// standard, restrained pattern (every SaaS landing page does this), not a
// gimmick, and it respects prefers-reduced-motion via the CSS in home.css.

document.addEventListener('DOMContentLoaded', () => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
});
