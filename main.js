/* main.js – lightweight progressive enhancement */
'use strict';

/* ── 1. Sticky header shadow on scroll ─────────── */
const header = document.querySelector('.site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ── 2. Mobile nav toggle ───────────────────────── */
const toggle  = document.querySelector('.nav__toggle');
const navMenu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('is-open', !expanded);
  document.body.style.overflow = expanded ? '' : 'hidden';
});

/* Close nav when any link is clicked (mobile UX) */
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});

/* ── 3. Scroll-triggered reveal animations ──────── */
const revealTargets = document.querySelectorAll(
  '.skill-card, .project-card, .contact__item, .about__grid, .about__text p'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

/* Only add animation if the user hasn't requested reduced motion */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(1.5rem)';
    el.style.transition = `opacity 0.5s ${i * 0.06}s ease, transform 0.5s ${i * 0.06}s ease`;
    revealObserver.observe(el);
  });
}

/* ── 4. Active nav link highlight on scroll ─────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__links a');

const activeLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(section => activeLinkObserver.observe(section));

/* ── 5. Contact form – basic validation feedback ─── */
const form = document.querySelector('.contact__form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = form.querySelector('#name').value.trim();
  const email   = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();

  if (!name || !email || !message) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }

  /* Simulate successful submission */
  showFormMessage('Thanks for reaching out! I'll get back to you soon. 🎉', 'success');
  form.reset();
});

function showFormMessage(text, type) {
  /* Remove any existing message */
  form.querySelector('.form-message')?.remove();

  const msg = document.createElement('p');
  msg.className = `form-message form-message--${type}`;
  msg.setAttribute('role', 'alert');
  msg.textContent = text;

  /* Style inline so no extra CSS file is needed */
  Object.assign(msg.style, {
    padding:      '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize:     'var(--fs-sm)',
    fontWeight:   '500',
    marginTop:    '0.5rem',
    background:   type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
    border:       `1px solid ${type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
    color:        type === 'success' ? '#86efac' : '#fca5a5',
  });

  form.appendChild(msg);

  /* Auto-dismiss after 5 s */
  setTimeout(() => msg.remove(), 5000);
}
