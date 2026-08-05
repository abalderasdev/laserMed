/* ============================================
   LaserMed Â· Main JS
   Minimal Â· scroll nativo del browser
   ============================================ */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ============================================
     1. NAV Â· scroll state (throttled rAF)
     ============================================ */

  const nav = $('#nav');
  let navTicking = false;
  const updateNav = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    navTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      requestAnimationFrame(updateNav);
      navTicking = true;
    }
  }, { passive: true });
  updateNav();

  /* ============================================
     2. MOBILE MENU
     ============================================ */

  const burger = $('#navBurger');
  const mobile = $('#navMobile');

  if (burger && mobile) {
    const closeMenu = () => {
      mobile.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobile.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      mobile.classList.add('is-open');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobile.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    burger.addEventListener('click', () => {
      mobile.classList.contains('is-open') ? closeMenu() : openMenu();
    });
    $$('a', mobile).forEach((a) => a.addEventListener('click', closeMenu));
  }

  /* ============================================
     3. SMOOTH SCROLL Â· NATIVO (CSS ya hace scroll-behavior: smooth)
        Solo interceptamos para compensar el nav fijo
     ============================================ */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ============================================
     4. REVEAL Â· IntersectionObserver (one-shot, sin GSAP)
     ============================================ */

  const revealTargets = $$('.reveal, .reveal-fade, .reveal-scale, .reveal-blur, .clip-reveal, .line-mask, .word-mask, .line-draw');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================
     5. FAQ Â· accordion
     ============================================ */

  $$('.faq__item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        $$('.faq__item[open]').forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ============================================
     6. FORM Â· validation + WhatsApp
     ============================================ */

  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nombre = (data.get('nombre') || '').toString().trim();
      const telefono = (data.get('telefono') || '').toString().trim();
      const servicio = (data.get('servicio') || '').toString().trim();

      if (!nombre || !telefono || !servicio) {
        const firstEmpty = form.querySelector(':invalid') || form.querySelector('[required]');
        if (firstEmpty) firstEmpty.focus();
        form.classList.add('is-error');
        setTimeout(() => form.classList.remove('is-error'), 600);
        return;
      }

      const mensaje = (data.get('mensaje') || '').toString().trim();
      const text =
        `Hola LaserMed, soy ${nombre}.%0A` +
        `Me interesa: ${servicio}.%0A` +
        `WhatsApp: ${telefono}.%0A` +
        (mensaje ? `%0A${encodeURIComponent(mensaje)}` : '');
      const waUrl = `https://wa.me/5255XXXXXXX?text=${text}`;
      window.open(waUrl, '_blank', 'noopener');

      form.innerHTML = `
        <div style="text-align: center; padding: var(--sp-12) 0;">
          <div class="numeral" style="margin-bottom: var(--sp-4);">Â¡Listo!</div>
          <h3 style="font-family: var(--font-serif); font-size: 28px; margin-bottom: var(--sp-4);">Te contactamos en menos de 24 h.</h3>
          <p class="caption" style="max-width: 36ch; margin: 0 auto;">
            TambiÃ©n abrimos WhatsApp con tu mensaje prellenado.<br />
            Si no se abriÃ³, escrÃ­benos directo: <a href="${waUrl}" class="link">abrir WhatsApp</a>.
          </p>
        </div>
      `;
    });
  }

  /* ============================================
     7. KEYBOARD Â· ESC closes mobile menu
     ============================================ */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobile && mobile.classList.contains('is-open')) {
      burger.click();
    }
  });

  /* ============================================
     8. VIDEO Â· autoplay solo en desktop, pause off-screen
     ============================================ */

  /* ============================================
     8. AGENT WAVE · pause cuando off-viewport
     ============================================ */

  const wave = $('.agente__wave');
  if (wave && 'IntersectionObserver' in window) {
    const waveIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          wave.classList.toggle('is-paused', !entry.isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
    waveIo.observe(wave);
  }
})();
/* ============================================
   LaserMed Â· Agente AI (ElevenLabs)
   Stub de integraciÃ³n Â· reemplazable
   ============================================ */

(function () {
  'use strict';

  const trigger = document.getElementById('agentTrigger');
  const modal = document.getElementById('agentModal');
  const widgetContainer = document.getElementById('elevenlabs-widget');
  let initialized = false;

  if (!trigger || !modal) return;

  const ELEVENLABS_CONFIG = {
    agentId: 'TU_AGENT_ID_DE_ELEVENLABS',
  };

  const openModal = () => {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => modal.classList.add('is-open'));
    if (!initialized) {
      initElevenLabs();
      initialized = true;
    }
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 400);
  };

  trigger.addEventListener('click', openModal);
  document.querySelectorAll('[data-close]', modal).forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  async function initElevenLabs() {
    if (window.ElevenLabs) {
      try {
        if (window.ElevenLabs.mount) {
          await window.ElevenLabs.mount(widgetContainer, ELEVENLABS_CONFIG);
        } else if (window.ElevenLabs.init) {
          await window.ElevenLabs.init();
        }
      } catch (e) {
        showFallback(e.message);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    script.onload = async () => {
      try {
        if (window.ElevenLabs && window.ElevenLabs.mount) {
          await window.ElevenLabs.mount(widgetContainer, ELEVENLABS_CONFIG);
        } else if (window.Convai) {
          await window.Convai.init(ELEVENLABS_CONFIG);
        } else {
          showFallback('No se pudo cargar el agente.');
        }
      } catch (e) {
        showFallback(e.message);
      }
    };
    script.onerror = () => showFallback('No se pudo cargar ElevenLabs. Verifica tu conexiÃ³n.');
    document.head.appendChild(script);
  }

  function showFallback(msg) {
    widgetContainer.innerHTML = `
      <div style="text-align: center; padding: var(--sp-8) var(--sp-4);">
        <p class="caption" style="margin-bottom: var(--sp-6);">${msg || 'El agente no estÃ¡ disponible ahora.'}</p>
        <a href="https://wa.me/5255XXXXXXX" target="_blank" rel="noopener" class="btn btn--whatsapp">
          Mejor hÃ¡blanos por WhatsApp
        </a>
        <p class="caption" style="margin-top: var(--sp-6);">
          O escrÃ­benos a <a href="mailto:hola@lasermed.mx" class="link">hola@lasermed.mx</a>
        </p>
      </div>
    `;
  }
})();
