// ============================================================
// CipherAudit — About page interactivity
// Fades in cards as they scroll into view using IntersectionObserver.
// ============================================================

const revealTargets = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => observer.observe(el));
