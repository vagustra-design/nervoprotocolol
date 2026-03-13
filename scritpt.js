/* ============================================
   NERVO™ — Executive Cognitive Foundation Protocol
   JavaScript — Interactions & Animations
   ============================================ */

(function () {
  'use strict';

  // Custom cursor removido.

  // ==========================================
  // SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    scrollProgress.style.transform = `scaleX(${progress})`;
  }

  // ==========================================
  // STICKY NAV ON SCROLL
  // ==========================================
  const nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // ==========================================
  // REVEAL ON SCROLL (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger reveals within the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, idx * 80);
          }
        });
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // PROGRESS BARS ANIMATION (Day Cards)
  // ==========================================
  const dayFills = document.querySelectorAll('.day-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const targetWidth = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = targetWidth;
        }, 400);
        barObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  dayFills.forEach(fill => barObserver.observe(fill));

  // ==========================================
  // CROSSED ITEMS (Not items in NERVO section)
  // ==========================================
  const crossedItems = document.querySelectorAll('.not-item.crossed');

  const crossObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.parentElement.querySelectorAll('.not-item.crossed');
        items.forEach((item, i) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, i * 200);
        });
        crossObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  crossedItems.forEach(item => crossObserver.observe(item));

  // ==========================================
  // SMOOTH SCROLL FOR ALL ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ==========================================
  // MODAL
  // ==========================================
  const checkoutBtn = document.getElementById('checkoutBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', openModal);
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================================
  // HERO TITLE PARALLAX
  // ==========================================
  const heroContent = document.querySelector('.hero-content');

  function heroParallax() {
    if (!heroContent) return;
    const scrollY = window.scrollY;
    const heroH = document.getElementById('hero').offsetHeight;
    if (scrollY < heroH) {
      heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
      heroContent.style.opacity = `${1 - scrollY / (heroH * 0.8)}`;
    }
  }

  // ==========================================
  // NUMBER COUNTER ANIMATION
  // ==========================================
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ==========================================
  // STEP HOVER INTERACTIONS
  // ==========================================
  const seqSteps = document.querySelectorAll('.seq-step');

  seqSteps.forEach((step) => {
    step.addEventListener('mouseenter', function () {
      seqSteps.forEach(s => {
        if (s !== this) {
          s.style.opacity = '0.4';
        }
      });
    });

    step.addEventListener('mouseleave', function () {
      seqSteps.forEach(s => {
        s.style.opacity = '1';
      });
    });
  });

  // ==========================================
  // DAY CARD HOVER EFFECTS
  // ==========================================
  const dayCards = document.querySelectorAll('.day-card');

  dayCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      dayCards.forEach(c => {
        if (c !== this) {
          c.style.opacity = '0.5';
        }
      });
    });

    card.addEventListener('mouseleave', function () {
      dayCards.forEach(c => {
        c.style.opacity = '1';
      });
    });
  });

  // ==========================================
  // COST ITEMS STAGGER ANIMATION
  // ==========================================
  const costItems = document.querySelectorAll('.cost-item');

  const costObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = document.querySelectorAll('.cost-item');
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          item.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 100 + i * 150);
        });
        costObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (costItems.length > 0) {
    costObserver.observe(costItems[0]);
  }

  // ==========================================
  // TICKER / TYPE EFFECT for HERO eyebrow
  // ==========================================
  const heroEyebrow = document.querySelector('.hero-eyebrow span:nth-child(2)');
  if (heroEyebrow) {
    const text = heroEyebrow.textContent;
    heroEyebrow.textContent = '';
    let index = 0;

    setTimeout(() => {
      const typeInterval = setInterval(() => {
        heroEyebrow.textContent += text[index];
        index++;
        if (index >= text.length) clearInterval(typeInterval);
      }, 60);
    }, 600);
  }

  // ==========================================
  // MAIN SCROLL EVENT
  // ==========================================
  function onScroll() {
    updateScrollProgress();
    updateNav();
    heroParallax();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    updateNav();
    updateScrollProgress();

    // Trigger hero reveals with stagger
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + i * 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ==========================================
  // SMOOTH SECTION INDICATOR
  // ==========================================
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Could be used to update nav active state or URL hash
        // history.replaceState(null, null, '#' + entry.target.id);
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(s => sectionObserver.observe(s));

})();