/* ====================================================
   NERVO™ — pagamento.js
   Página de Pagamento — JavaScript Interativo
   ==================================================== */

(function () {
  'use strict';

  const PIX_CODE = '00020101021226880014BR.GOV.BCB.PIX0140vagustravagusnervesomaticregul@gmail.com0222Pagamento vastraneuror5204000053039865406997.005802BR5925JULIANE DA SILVA CERQUEIR6015SAO GONCALO DOS62290525QRCCygl68hUdgx0ES90eVXaHP6304C484';

  /* ===========================
     1. SCROLL REVEAL
     =========================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 0.07 + 's';
    revealObs.observe(el);
  });

  // Trigger immediately visible elements
  setTimeout(() => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 20) {
        el.classList.add('visible');
      }
    });
  }, 100);


  /* ===========================
     2. PIX QR CODE
     (imagem estática: nervopix.png)
     =========================== */
  // QR Code servido como imagem — sem geração dinâmica necessária.

  /* ===========================
     3. TAB SWITCHING
     =========================== */
  window.switchTab = function (tab) {
    // Update tabs
    document.querySelectorAll('.pay-tab').forEach((t) => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    // Update panels
    document.querySelectorAll('.pay-panel').forEach((p) => p.classList.remove('active'));
    document.getElementById(`panel-${tab}`).classList.add('active');

    // Re-trigger reveals in new panel
    document.querySelectorAll(`#panel-${tab} .reveal`).forEach((el) => {
      if (!el.classList.contains('visible')) {
        setTimeout(() => el.classList.add('visible'), 50);
      }
    });
  };

  /* ===========================
     4. COPY PIX CODE
     =========================== */
  window.copyPix = function () {
    const input = document.getElementById('pixCodeInput');
    const btn = document.getElementById('copyPixBtn');
    const btnText = document.getElementById('copyPixText');

    if (!input || !btn || !btnText) return;

    const text = input.value;

    // Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showCopied(btn, btnText))
        .catch(() => fallbackCopy(text, btn, btnText));
    } else {
      fallbackCopy(text, btn, btnText);
    }
  };

  function fallbackCopy(text, btn, btnText) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopied(btn, btnText);
    } catch (e) {
      btnText.textContent = 'Erro';
    }
    document.body.removeChild(ta);
  }

  function showCopied(btn, btnText) {
    btn.classList.add('copied');
    btnText.textContent = '✔ Copiado!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btnText.textContent = 'Copiar';
    }, 2500);
  }

  /* ===========================
     5. PIX BUTTON — COPIAR CÓDIGO
     =========================== */
  window.copyPixAndConfirm = function () {
    const btnText = document.getElementById('pixBtnText');
    const text = PIX_CODE;

    function onSuccess() {
      if (btnText) {
        btnText.textContent = '✔ Código PIX Copiado!';
        const btn = btnText.closest('button');
        if (btn) {
          btn.style.background = '#22c55e';
          btn.style.boxShadow = '0 6px 32px rgba(34,197,94,0.45)';
        }
        // Also update the small copy button
        const smallBtn = document.getElementById('copyPixBtn');
        const smallText = document.getElementById('copyPixText');
        if (smallBtn && smallText) {
          smallBtn.classList.add('copied');
          smallText.textContent = '✔ Copiado!';
        }
        setTimeout(() => {
          btnText.textContent = 'Pagar com PIX — Copiar Código';
          if (btn) {
            btn.style.background = '';
            btn.style.boxShadow = '';
          }
          if (smallBtn && smallText) {
            smallBtn.classList.remove('copied');
            smallText.textContent = 'Copiar';
          }
        }, 3000);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
        legacyCopy(text, onSuccess);
      });
    } else {
      legacyCopy(text, onSuccess);
    }
  };

  function legacyCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }




  /* ===========================
     7. BUTTON RIPPLE EFFECT
     =========================== */
  document.querySelectorAll('.btn-pay, .btn-copy-pix').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        background: rgba(255,255,255,0.15);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnim 0.5s ease-out forwards;
        z-index: 20;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 520);
    });
  });

  const rippleKF = document.createElement('style');
  rippleKF.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(rippleKF);

  /* ===========================
     8. PARCEL CARD SELECTION
     =========================== */
  document.querySelectorAll('.parcel-item').forEach((item) => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.parcel-item').forEach((i) => i.classList.remove('parcel-best'));
      this.classList.add('parcel-best');
    });
  });

  /* ===========================
     9. PRICE COUNTER ANIMATION
     =========================== */
  const priceEl = document.querySelector('.sc-price');

  if (priceEl) {
    const priceObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = 997;
            const duration = 1000;
            const start = Date.now();
            function tick() {
              const t = Math.min((Date.now() - start) / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              priceEl.textContent = 'R$' + Math.round(eased * target).toLocaleString('pt-BR');
              if (t < 1) requestAnimationFrame(tick);
            }
            tick();
            priceObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    priceObs.observe(priceEl);
  }

  /* ===========================
     10. PAGE LOAD FADE IN
     =========================== */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

})();