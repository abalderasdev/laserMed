/* ============================================
   LaserMed · Main JS
   Performance-first · un solo ticker GSAP
   ============================================ */

(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     1. NAV · scroll state (con throttling via rAF)
     ============================================ */

  const nav = $('#nav');
  let navTicking = false;

  const onScroll = () => {
    if (navTicking) return;
    navTicking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 50);
      navTicking = false;
    });
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
     3. SMOOTH SCROLL · Lenis integrado con GSAP
     ============================================ */

  let lenis = null;
  if (window.Lenis && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    // UN SOLO TICKER: GSAP maneja Lenis y ScrollTrigger juntos
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger usa el proxy de Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Anchor links
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70, duration: 1.2 });
        }
      });
    });
  } else {
    // Fallback nativo
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================
     4. REVEAL · IntersectionObserver eficiente
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
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================
     5. GSAP · solo lo crítico (parallax hero + un par de polishes)
     ============================================ */

  if (window.gsap && window.ScrollTrigger && !reducedMotion) {
    // Parallax hero media (más sutil para no joder el scroll)
    const heroMedia = $('.hero__media');
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }

    // Hover effect sutil en cards de servicio (solo en desktop)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      $$('.card').forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -4, duration: 0.4, ease: 'power3.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: 'power3.out' });
        });
      });
    }
  }

  /* ============================================
     6. FAQ · accordion
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
     7. FORM · validation + WhatsApp
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
     8. KEYBOARD · ESC closes mobile menu
     ============================================ */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobile && mobile.classList.contains('is-open')) {
      burger.click();
    }
  });

  /* ============================================
     9. IDLE video · pause when off-screen
     ============================================ */

  const heroVideo = $('.hero__media video');
  if (heroVideo && 'IntersectionObserver' in window) {
    const vidIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            heroVideo.play().catch(() => {});
          } else {
            heroVideo.pause();
          }
        }
      },
      { threshold: 0.1 }
    );
    vidIo.observe(heroVideo);
  }
})();
