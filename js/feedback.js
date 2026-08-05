/* ============================================
   LaserMed · Feedback Layer
   Cliente clickea un elemento → deja un cambio.
   Lista se guarda en localStorage y se exporta.
   Activable con ?feedback=1 o click en el botón.
   Admin panel con ?admin=1
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'lasermed_feedback_v1';
  const isAdmin = window.location.search.includes('admin=1');
  const forceOn = window.location.search.includes('feedback=1');
  let feedbackMode = forceOn;
  let selectedElement = null;

  /* ============================================
     Storage
     ============================================ */

  function loadFeedbacks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  }

  function saveFeedbacks(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function addFeedback(entry) {
    const arr = loadFeedbacks();
    arr.push(entry);
    saveFeedbacks(arr);
  }

  function clearAllFeedbacks() {
    if (confirm('¿Borrar todos los feedbacks? Esta acción no se puede deshacer.')) {
      saveFeedbacks([]);
      renderAdmin();
    }
  }

  /* ============================================
     Floating button (siempre visible)
     ============================================ */

  function createFloatingButton() {
    if (document.getElementById('feedbackToggle')) return;
    const btn = document.createElement('button');
    btn.id = 'feedbackToggle';
    btn.className = 'feedback-toggle';
    btn.setAttribute('aria-label', 'Activar modo feedback');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Feedback</span>';
    btn.addEventListener('click', toggleFeedbackMode);
    document.body.appendChild(btn);
  }

  function updateToggleUI() {
    const btn = document.getElementById('feedbackToggle');
    if (!btn) return;
    if (feedbackMode) {
      btn.classList.add('is-active');
      btn.querySelector('span').textContent = 'Click un elemento';
    } else {
      btn.classList.remove('is-active');
      btn.querySelector('span').textContent = 'Feedback';
    }
  }

  /* ============================================
     Feedback mode
     ============================================ */

  function toggleFeedbackMode() {
    feedbackMode = !feedbackMode;
    if (feedbackMode) {
      enableFeedbackMode();
    } else {
      disableFeedbackMode();
    }
    updateToggleUI();
  }

  function enableFeedbackMode() {
    document.body.classList.add('feedback-mode');
    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('mouseout', onUnhover, true);
    document.addEventListener('click', onClick, true);
  }

  function disableFeedbackMode() {
    document.body.classList.remove('feedback-mode');
    document.removeEventListener('mouseover', onHover, true);
    document.removeEventListener('mouseout', onUnhover, true);
    document.removeEventListener('click', onClick, true);
    clearHighlight();
    closePanel();
  }

  function onHover(e) {
    if (!feedbackMode) return;
    const el = pickElement(e.target);
    if (!el) return;
    el.classList.add('feedback-highlight');
  }

  function onUnhover(e) {
    if (!feedbackMode) return;
    const el = pickElement(e.target);
    if (el) el.classList.remove('feedback-highlight');
  }

  function onClick(e) {
    if (!feedbackMode) return;
    // Ignorar clicks en el propio feedback UI
    if (e.target.closest('.feedback-toggle, .feedback-panel, .feedback-admin')) return;
    e.preventDefault();
    e.stopPropagation();
    const el = pickElement(e.target);
    if (!el) return;
    selectedElement = el;
    el.classList.add('feedback-selected');
    openPanel(el);
  }

  function pickElement(target) {
    // Elige el ancestro más cercano con un selector identificable
    if (!target || target === document.body) return null;
    let el = target;
    while (el && el !== document.body) {
      // Ignorar elementos del feedback UI
      if (el.closest('.feedback-toggle, .feedback-panel, .feedback-admin')) return null;
      // Ignorar elementos vacíos o muy pequeños
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return null;
      el = el.parentElement;
    }
    return target;
  }

  function clearHighlight() {
    document.querySelectorAll('.feedback-highlight, .feedback-selected')
      .forEach((el) => el.classList.remove('feedback-highlight', 'feedback-selected'));
  }

  /* ============================================
     Panel (form para dejar feedback)
     ============================================ */

  function openPanel(el) {
    closePanel();
    const panel = document.createElement('div');
    panel.className = 'feedback-panel';
    panel.id = 'feedbackPanel';
    panel.innerHTML = `
      <div class="feedback-panel__head">
        <div>
          <div class="feedback-panel__eyebrow">Feedback del cliente</div>
          <div class="feedback-panel__el">${describeElement(el)}</div>
        </div>
        <button class="feedback-panel__close" data-action="close" aria-label="Cerrar">×</button>
      </div>
      <form class="feedback-panel__form" id="feedbackForm">
        <label class="feedback-panel__label">¿Qué cambio quieres pedir?</label>
        <textarea class="feedback-panel__input" name="comment" rows="4" required placeholder="Ej. cambiar este titular, mover este botón, usar color cobre en lugar de azul..." autofocus></textarea>
        <div class="feedback-panel__row">
          <input class="feedback-panel__input feedback-panel__input--text" name="author" type="text" placeholder="Tu nombre (opcional)" />
        </div>
        <div class="feedback-panel__actions">
          <button type="button" class="feedback-panel__btn feedback-panel__btn--ghost" data-action="close">Cancelar</button>
          <button type="submit" class="feedback-panel__btn feedback-panel__btn--primary">Enviar feedback</button>
        </div>
      </form>
    `;
    document.body.appendChild(panel);
    requestAnimationFrame(() => panel.classList.add('is-open'));
    panel.querySelector('[data-action="close"]').addEventListener('click', closePanel);
    panel.querySelector('#feedbackForm').addEventListener('submit', onSubmitFeedback);
  }

  function closePanel() {
    const panel = document.getElementById('feedbackPanel');
    if (!panel) return;
    panel.classList.remove('is-open');
    setTimeout(() => panel.remove(), 250);
    if (selectedElement) {
      selectedElement.classList.remove('feedback-selected');
      selectedElement = null;
    }
  }

  function describeElement(el) {
    const tag = el.tagName.toLowerCase();
    const cls = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '';
    const id = el.id ? '#' + el.id : '';
    const text = (el.innerText || '').trim().slice(0, 60);
    return `<${tag}${id}${cls}> "${text}${(el.innerText || '').length > 60 ? '...' : ''}"`;
  }

  function onSubmitFeedback(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const comment = form.comment.value.trim();
    const author = form.author.value.trim() || 'Anónimo';
    if (!comment) return;

    const el = selectedElement;
    const entry = {
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      timestamp: new Date().toISOString(),
      author,
      comment,
      element: {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: el.className && typeof el.className === 'string' ? el.className.split(' ').filter(Boolean) : [],
        text: (el.innerText || '').trim().slice(0, 200),
        path: getElementPath(el),
        section: getSection(el),
        rect: el.getBoundingClientRect ? {
          x: Math.round(el.getBoundingClientRect().left),
          y: Math.round(el.getBoundingClientRect().top + window.scrollY),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
        } : null,
      },
      url: window.location.href,
      scrollY: window.scrollY,
    };

    addFeedback(entry);
    form.reset();
    closePanel();
    disableFeedbackMode();
    feedbackMode = false;
    updateToggleUI();
    showToast('Feedback enviado · ¡gracias!');
  }

  function getElementPath(el) {
    const path = [];
    let cur = el;
    while (cur && cur !== document.body && path.length < 6) {
      const tag = cur.tagName.toLowerCase();
      const id = cur.id ? '#' + cur.id : '';
      path.unshift(tag + id);
      cur = cur.parentElement;
    }
    return path.join(' > ');
  }

  function getSection(el) {
    const sec = el.closest('section, header, footer, main');
    return sec ? (sec.id || sec.className || sec.tagName.toLowerCase()) : null;
  }

  /* ============================================
     Toast
     ============================================ */

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'feedback-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-visible'));
    setTimeout(() => {
      t.classList.remove('is-visible');
      setTimeout(() => t.remove(), 300);
    }, 2500);
  }

  /* ============================================
     Admin panel (?admin=1)
     ============================================ */

  function renderAdmin() {
    closeAdmin();
    const wrap = document.createElement('div');
    wrap.id = 'feedbackAdmin';
    wrap.className = 'feedback-admin';
    const arr = loadFeedbacks();
    wrap.innerHTML = `
      <div class="feedback-admin__head">
        <h1>LaserMed · Feedback Admin</h1>
        <div>
          <span class="feedback-admin__count">${arr.length} feedback${arr.length !== 1 ? 's' : ''}</span>
          <button class="feedback-admin__btn feedback-admin__btn--ghost" data-action="export">Exportar JSON</button>
          <button class="feedback-admin__btn feedback-admin__btn--danger" data-action="clear">Borrar todo</button>
          <button class="feedback-admin__btn" data-action="close">Cerrar</button>
        </div>
      </div>
      <div class="feedback-admin__list">
        ${arr.length === 0
          ? '<p class="feedback-admin__empty">Sin feedbacks aún. Comparte <code>?feedback=1</code> con tu cliente para que pueda dejar cambios.</p>'
          : arr.map(renderFeedbackCard).join('')
        }
      </div>
    `;
    document.body.appendChild(wrap);
    wrap.querySelector('[data-action="close"]').addEventListener('click', closeAdmin);
    wrap.querySelector('[data-action="export"]').addEventListener('click', exportJSON);
    wrap.querySelector('[data-action="clear"]').addEventListener('click', clearAllFeedbacks);
  }

  function closeAdmin() {
    const el = document.getElementById('feedbackAdmin');
    if (el) el.remove();
  }

  function renderFeedbackCard(fb) {
    const date = new Date(fb.timestamp);
    const dateStr = date.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    return `
      <article class="feedback-card">
        <header>
          <div>
            <strong>${escapeHTML(fb.author)}</strong>
            <span class="feedback-card__date">${dateStr}</span>
          </div>
          <code class="feedback-card__el">${escapeHTML(fb.element.tag)}${fb.element.id ? '#' + escapeHTML(fb.element.id) : ''}</code>
        </header>
        <p class="feedback-card__comment">${escapeHTML(fb.comment)}</p>
        <details>
          <summary>Contexto</summary>
          <dl>
            <dt>Sección</dt><dd>${escapeHTML(fb.element.section || '—')}</dd>
            <dt>Path</dt><dd><code>${escapeHTML(fb.element.path)}</code></dd>
            <dt>Texto</dt><dd>${escapeHTML(fb.element.text || '—')}</dd>
            <dt>URL</dt><dd><code>${escapeHTML(fb.url)}</code></dd>
            <dt>Posición</dt><dd>y=${fb.element.rect ? fb.element.rect.y : '—'}px</dd>
          </dl>
        </details>
      </article>
    `;
  }

  function exportJSON() {
    const arr = loadFeedbacks();
    const blob = new Blob([JSON.stringify(arr, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lasermed-feedback-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ============================================
     Init
     ============================================ */

  document.addEventListener('DOMContentLoaded', () => {
    if (isAdmin) {
      renderAdmin();
    } else {
      createFloatingButton();
      updateToggleUI();
      if (forceOn) {
        enableFeedbackMode();
      }
    }
  });
})();
