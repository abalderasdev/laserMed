/* ============================================
   LaserMed · Agente AI (ElevenLabs)
   Stub de integración · reemplazable
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
    script.onerror = () => showFallback('No se pudo cargar ElevenLabs. Verifica tu conexión.');
    document.head.appendChild(script);
  }

  function showFallback(msg) {
    widgetContainer.innerHTML = `
      <div style="text-align: center; padding: var(--sp-8) var(--sp-4);">
        <p class="caption" style="margin-bottom: var(--sp-6);">${msg || 'El agente no está disponible ahora.'}</p>
        <a href="https://wa.me/5255XXXXXXX" target="_blank" rel="noopener" class="btn btn--whatsapp">
          Mejor háblanos por WhatsApp
        </a>
        <p class="caption" style="margin-top: var(--sp-6);">
          O escríbenos a <a href="mailto:hola@lasermed.mx" class="link">hola@lasermed.mx</a>
        </p>
      </div>
    `;
  }
})();
