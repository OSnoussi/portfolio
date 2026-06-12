/* =============================================
   PORTFOLIO — OBEID SNOUSSI — script.js
   ============================================= */

/* ─── NAVBAR scroll + active link ─── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveLink();
});

function updateActiveLink() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

/* ─── MOBILE MENU ─── */
const navToggle = document.getElementById('navToggle');
const navList = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navList.classList.toggle('open'));
navLinks.forEach(l => l.addEventListener('click', () => navList.classList.remove('open')));

/* ─── REVEAL on scroll (IntersectionObserver) ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.comp-card, .project-card-sm, .project-card-lg, .timeline-item, .cv-block, .task-item, .stage-comp-item')
  .forEach(el => { el.classList.add('reveal'); observer.observe(el); });

/* ─── SKILL BARS animation ─── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width || bar.style.width;
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bars').forEach(el => skillObserver.observe(el));

/* ─── CAROUSELS ─── */
document.querySelectorAll('.proj-carousel').forEach(carousel => {
  const imgs = carousel.querySelectorAll('img');
  const dots = carousel.querySelectorAll('.carousel-dot');
  if (imgs.length <= 1) return;

  let current = 0;
  let timer = setInterval(() => advance(1), 3500);

  function show(idx) {
    imgs[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + imgs.length) % imgs.length;
    imgs[current].classList.add('active');
    dots[current]?.classList.add('active');
  }
  function advance(dir) { show(current + dir); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(timer); show(i); timer = setInterval(() => advance(1), 3500); });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => { timer = setInterval(() => advance(1), 3500); });
});

/* ─── SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
  });
});

/* ─── COMP CARD expand on click ─── */
document.querySelectorAll('.comp-card').forEach(card => {
  const exemples = card.querySelector('.comp-exemples');
  if (!exemples) return;
  exemples.style.maxHeight = '0';
  exemples.style.overflow = 'hidden';
  exemples.style.transition = 'max-height 0.35s ease, padding-top 0.35s ease, opacity 0.35s ease';
  exemples.style.opacity = '0';
  let open = false;
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    open = !open;
    exemples.style.maxHeight = open ? '300px' : '0';
    exemples.style.opacity = open ? '1' : '0';
    card.style.borderColor = open ? 'rgba(0,212,255,0.4)' : '';
  });
});

/* ─── HERO counter animation ─── */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const isPlus = String(target).includes('+');
  const num = parseInt(String(target));
  const step = Math.ceil(num / (duration / 30));
  const t = setInterval(() => {
    start = Math.min(start + step, num);
    el.textContent = start + (isPlus ? '+' : '');
    if (start >= num) clearInterval(t);
  }, 30);
}

const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, el.textContent);
      });
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);
