/* ============================================
   LaserMed · Main JS
   Init: nav · smooth scroll · GSAP reveals · FAQ · form
   ============================================ */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ============================================
     1. NAV · scroll state
     ============================================ */

  const nav = $('#nav');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 50);
    lastScroll = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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
     3. SMOOTH SCROLL (Lenis + native fallback)
     ============================================ */

  if (window.Lenis) {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor links
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80, duration: 1.4 });
        }
      });
    });
  } else {
    // Native fallback
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================
     4. REVEAL ON SCROLL · IntersectionObserver + CSS classes
     ============================================ */

  const revealTargets = $$('.reveal, .reveal-fade, .reveal-scale, .reveal-blur, .clip-reveal, .line-mask, .word-mask, .line-draw');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealTargets.forEach((el) => io.observe(el));
  } else {
    // Fallback: show all
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================
     5. GSAP · hero entry animation (extra polish)
     ============================================ */

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero — apenas carga, animar trust items y side quote (los word-masks se animan con CSS reveal)
    window.addEventListener('load', () => {
      // Parallax hero media
      gsap.to('.hero__media', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Section titles
      $$('h2').forEach((h2) => {
        gsap.from(h2, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: h2,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // FAQ items
      $$('.faq__item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 16,
          duration: 0.7,
          delay: i * 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            once: true,
          },
        });
      });
    });
  }

  /* ============================================
     6. FAQ · details fallback + custom animation
     ============================================ */

  $$('.faq__item').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Close other open items (accordion behavior)
        $$('.faq__item[open]').forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ============================================
     7. FORM · validation + WhatsApp fallback
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
        const firstEmpty = form.querySelector(':invalid') || form.querySelector('[required]:not(:placeholder-shown)');
        if (firstEmpty) firstEmpty.focus();
        // Visual error pulse
        form.classList.add('is-error');
        setTimeout(() => form.classList.remove('is-error'), 600);
        return;
      }

      const mensaje = (data.get('mensaje') || '').toString().trim();

      // Build WhatsApp message
      const text =
        `Hola LaserMed, soy ${nombre}.%0A` +
        `Me interesa: ${servicio}.%0A` +
        `WhatsApp: ${telefono}.%0A` +
        (mensaje ? `%0A${encodeURIComponent(mensaje)}` : '');

      const waUrl = `https://wa.me/5255XXXXXXX?text=${text}`;

      // Track conversion (placeholder para analytics)
      // window.dataLayer = window.dataLayer || []; window.dataLayer.push({event: 'lead_form_submit'});

      window.open(waUrl, '_blank', 'noopener');

      // Success feedback
      form.innerHTML = `
        <div style="text-align: center; padding: var(--sp-12) 0;">
          <div class="numeral" style="margin-bottom: var(--sp-4);">¡Listo!</div>
          <h3 style="font-family: var(--font-serif); font-size: 28px; margin-bottom: var(--sp-4);">Te contactamos en menos de 24 h.</h3>
          <p class="caption" style="max-width: 36ch; margin: 0 auto;">
            También abrimos WhatsApp con tu mensaje prellenado.<br />
            Si no se abrió, escríbenos directo: <a href="${waUrl}" class="link">abrir WhatsApp</a>.
          </p>
        </div>
      `;
    });
  }

  /* ============================================
     8. AGENT WAVE · animated bars
     ============================================ */

  const wave = $('.agente__wave');
  if (wave) {
    const bars = $$('.ag-bar', wave);
    let phase = 0;

    const tick = () => {
      phase += 0.08;
      bars.forEach((bar, i) => {
        const t = phase + i * 0.18;
        const amplitude = 28 + Math.sin(t * 0.7) * 16;
        const offset = Math.sin(t) * amplitude;
        const y1 = 100 - offset;
        const y2 = 100 + offset;
        bar.setAttribute('y1', y1.toFixed(1));
        bar.setAttribute('y2', y2.toFixed(1));
      });
      requestAnimationFrame(tick);
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(tick);
    } else {
      // Reduced motion: static
      bars.forEach((bar, i) => {
        const offset = (i % 2 === 0 ? 1 : -1) * 20;
        bar.setAttribute('y1', 100 - offset);
        bar.setAttribute('y2', 100 + offset);
      });
    }
  }

  /* ============================================
     9. KEYBOARD · close mobile menu on ESC
     ============================================ */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobile && mobile.classList.contains('is-open')) {
        $('#navBurger').click();
      }
    }
  });
})();
