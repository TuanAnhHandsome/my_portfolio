/* ============================================
   PORTFOLIO — script.js
   Features:
     1. Typed text effect (hero role)
     2. Scroll reveal (IntersectionObserver)
     3. Skill bar animation on scroll
     4. Sticky nav: scrolled class + active link
     5. Mobile nav toggle
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. TYPED TEXT EFFECT
     ========================================== */
  const typedEl = document.getElementById('typed');
  const phrases = [
    'Software Engineering Student',
    'Full-Stack Developer',
    'Java + Spring Boot',
    'React Enthusiast',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  // Create blinking cursor element
  const cursor = document.createElement('span');
  cursor.classList.add('typed-cursor');
  typedEl.after(cursor);

  function type() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, 1400);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      typedEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Finished typing — pause then delete
        isPaused    = true;
        isDeleting  = true;
        setTimeout(type, 100);
        return;
      }
      setTimeout(type, 60);

    } else {
      // Deleting
      typedEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting  = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 32);
    }
  }

  // Start after hero animation settles
  setTimeout(type, 900);


  /* ==========================================
     2. SCROLL REVEAL — IntersectionObserver
     ========================================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Slight stagger for sibling elements revealed together
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const delay    = siblings.indexOf(entry.target) * 80;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ==========================================
     3. SKILL BAR ANIMATION
     ========================================== */
  const bars = document.querySelectorAll('.bar');

  // Set CSS variable from data attribute
  bars.forEach(bar => {
    const width = bar.getAttribute('data-w');
    bar.style.setProperty('--bar-w', width + '%');
  });

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay so reveal animation completes first
          setTimeout(() => {
            entry.target.classList.add('animate');
          }, 300);
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => barObserver.observe(bar));


  /* ==========================================
     4. STICKY NAV — scrolled class + active link
     ========================================== */
  const nav      = document.getElementById('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  function onScroll() {
    // Scrolled class for border
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link based on section in viewport
    let currentId = '';
    sections.forEach(sec => {
      const top    = sec.offsetTop - var_navH() - 60;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function var_navH() {
    return parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')
    ) || 64;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ==========================================
     5. MOBILE NAV TOGGLE
     ========================================== */
  const toggle = document.getElementById('navToggle');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });


  /* ==========================================
     6. SMOOTH SCROLL OFFSET (account for fixed nav)
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const offset = target.offsetTop - var_navH();
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

});