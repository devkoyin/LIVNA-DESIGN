/* ============================================================
   LIVNA — Shared JavaScript
   Navigation, scroll reveal, toasts, utilities
   ============================================================ */

/* ─── NAV SCROLL EFFECT ────────────────────────────────────── */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ─── MOBILE MENU ──────────────────────────────────────────── */
(function () {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const isOpen = mobileMenu.classList.contains('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── ACTIVE NAV LINK ──────────────────────────────────────── */
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ─── SCROLL REVEAL ────────────────────────────────────────── */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger reveals
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el, i) => {
    if (!el.dataset.delay) {
      // Auto-stagger siblings
      const parent = el.parentElement;
      const siblings = parent ? [...parent.querySelectorAll('.reveal')] : [];
      const index = siblings.indexOf(el);
      el.dataset.delay = index * 100;
    }
    observer.observe(el);
  });
})();

/* ─── TOAST NOTIFICATION ───────────────────────────────────── */
function showToast(message, duration = 4000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ─── NEWSLETTER FORM ──────────────────────────────────────── */
(function () {
  const form = document.querySelector('.footer__newsletter');
  if (!form) return;

  form.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input.value && input.value.includes('@')) {
      showToast('Thank you for subscribing to the Livna journal.');
      input.value = '';
    } else {
      showToast('Please enter a valid email address.');
    }
  });
})();

/* ─── CURSOR ENHANCEMENT (desktop) ────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: #C9A96E;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease, opacity 0.3s ease;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(cursor);

  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed;
    width: 32px;
    height: 32px;
    border: 1px solid rgba(201, 169, 110, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: transform 0.4s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
  `;
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';

    requestAnimationFrame(() => {
      ring.style.left = mouseX + 'px';
      ring.style.top = mouseY + 'px';
    });
  });

  document.querySelectorAll('a, button, .portfolio__item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'rgba(201, 169, 110, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(201, 169, 110, 0.5)';
    });
  });
})();
