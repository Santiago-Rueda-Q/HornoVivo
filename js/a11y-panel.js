'use strict';
// ============================================================
// MÓDULO: a11y-panel.js
// Panel de herramientas de accesibilidad: controles visuales,
// perfiles rápidos, síntesis de voz y atajos de teclado.
// ============================================================
import { settings, setSettings, applySettings, allowedClasses } from './settings.js';
import { announce } from './announce.js';
import { showToast } from './announce.js';

const body = document.body;
const root = document.documentElement;

// ── Elementos del panel ──────────────────────────────────────
const a11yLauncher = document.getElementById('a11yLauncher');
const a11yPanel    = document.getElementById('a11yPanel');
const closeA11yBtn = document.getElementById('closeA11y');

// ── Modal de atajos ──────────────────────────────────────────
const infoModal      = document.getElementById('infoModal');
const openInfoModal  = document.getElementById('openInfoModal');
const closeInfoModal = document.getElementById('closeInfoModal');
const modalAccept    = document.getElementById('modalAccept');

// ── Guía de lectura ──────────────────────────────────────────
const readingGuide = document.getElementById('readingGuide');

// ── Síntesis de voz ──────────────────────────────────────────
let speaking = false;

// ── Helpers ──────────────────────────────────────────────────
function sync() { applySettings(body, root); }

function updatePressedStates() {
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(body.classList.contains(btn.dataset.toggle)));
  });
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) themeBtn.setAttribute('aria-pressed', String(settings.theme === 'dark'));
}

// Sobrescribimos applySettings para que también actualice estados pressed
function apply() {
  sync();
  updatePressedStates();
}

// ── Panel abierto / cerrado ──────────────────────────────────
export function openA11yPanel() {
  if (!a11yPanel || !a11yLauncher) return;
  a11yPanel.hidden = false;
  a11yLauncher.setAttribute('aria-expanded', 'true');
  if (closeA11yBtn) closeA11yBtn.focus();
}

export function closeA11yPanel() {
  if (!a11yPanel || !a11yLauncher) return;
  a11yPanel.hidden = true;
  a11yLauncher.setAttribute('aria-expanded', 'false');
  a11yLauncher.focus();
}

// ── Modal de información / atajos ────────────────────────────
function openModal() {
  if (!infoModal) return;
  infoModal.showModal();
  if (closeInfoModal) closeInfoModal.focus();
}

function closeModal() {
  if (!infoModal) return;
  infoModal.close();
  if (openInfoModal) openInfoModal.focus();
}

// ── Cambiar tamaño de fuente ─────────────────────────────────
function changeFont(delta) {
  settings.fontScale = Math.max(80, Math.min(150, settings.fontScale + delta));
  apply();
  announce(`Tamaño de texto al ${settings.fontScale} por ciento.`);
}

// ── Perfiles rápidos ─────────────────────────────────────────
const profiles = {
  cognitive: ['readable-font', 'wide-spacing', 'pause-motion'],
  lowVision: ['high-contrast', 'focus-strong', 'big-cursor'],
  motor:     ['focus-strong', 'big-cursor', 'pause-motion', 'guide-enabled']
};

// ── Síntesis de voz ──────────────────────────────────────────
function toggleSpeech(speakButton) {
  if (!('speechSynthesis' in window)) {
    showToast('La lectura en voz alta no está disponible en este navegador.');
    return;
  }
  if (speaking) {
    window.speechSynthesis.cancel();
    speaking = false;
    speakButton.setAttribute('aria-pressed', 'false');
    announce('Lectura detenida.');
    return;
  }
  const mainEl = document.querySelector('main');
  const text   = mainEl ? mainEl.innerText : '';
  const utt    = new SpeechSynthesisUtterance(text);
  utt.lang     = 'es-CO';
  utt.onend    = () => { speaking = false; speakButton.setAttribute('aria-pressed', 'false'); };
  speaking     = true;
  speakButton.setAttribute('aria-pressed', 'true');
  window.speechSynthesis.speak(utt);
  announce('Lectura iniciada. Pulsa nuevamente para detener.');
}

// ── Inicialización ───────────────────────────────────────────
export function initA11yPanel() {

  // Lanzador / cierre del panel
  if (a11yLauncher && a11yPanel) {
    a11yLauncher.addEventListener('click', () =>
      a11yPanel.hidden ? openA11yPanel() : closeA11yPanel()
    );
  }
  if (closeA11yBtn) closeA11yBtn.addEventListener('click', closeA11yPanel);

  // Modal de accesibilidad (botón "Accesibilidad del sitio" en el hero)
  if (openInfoModal) openInfoModal.addEventListener('click', openModal);
  if (closeInfoModal) closeInfoModal.addEventListener('click', closeModal);
  if (modalAccept)    modalAccept.addEventListener('click', closeModal);
  if (infoModal) {
    infoModal.addEventListener('click', e => {
      const b = infoModal.getBoundingClientRect();
      if (e.clientX < b.left || e.clientX > b.right ||
          e.clientY < b.top  || e.clientY > b.bottom) closeModal();
    });
  }

  // Toggles visuales individuales
  document.querySelectorAll('[data-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cls    = btn.dataset.toggle;
      const active = settings.classes.includes(cls);
      settings.classes = active
        ? settings.classes.filter(c => c !== cls)
        : [...settings.classes, cls];
      apply();
      announce(`${btn.textContent.trim()} ${active ? 'desactivado' : 'activado'}.`);
    });
  });

  // Toggle tema oscuro/claro
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
      apply();
      announce(`Modo ${settings.theme === 'dark' ? 'oscuro' : 'claro'} activado.`);
    });
  }

  // Botones de tamaño de fuente
  document.getElementById('fontIncrease')?.addEventListener('click', () => changeFont(10));
  document.getElementById('fontDecrease')?.addEventListener('click', () => changeFont(-10));
  document.getElementById('fontReset')?.addEventListener('click', () => {
    settings.fontScale = 100;
    apply();
    announce('Tamaño de texto restablecido.');
  });

  // Perfiles rápidos
  document.querySelectorAll('[data-profile]').forEach(btn => {
    btn.addEventListener('click', () => {
      const profileClasses = profiles[btn.dataset.profile] || [];
      settings.classes = [...new Set([...settings.classes, ...profileClasses])];
      if (btn.dataset.profile === 'lowVision') settings.fontScale = 120;
      apply();
      announce(`${btn.textContent.trim()} activado.`);
    });
  });

  // Restablecer todo
  document.getElementById('resetAccessibility')?.addEventListener('click', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSettings({ fontScale: 100, theme: 'light', classes: [] });
    apply();
    showToast('Ajustes de accesibilidad restablecidos.');
    announce('Ajustes restablecidos.');
  });

  // Lectura en voz alta
  const speakBtn = document.getElementById('speakPage');
  if (speakBtn) speakBtn.addEventListener('click', () => toggleSpeech(speakBtn));

  // Atajos de teclado
  document.getElementById('keyboardHelp')?.addEventListener('click', () => {
    closeA11yPanel();
    openModal();
  });

  // Guía de lectura (sigue el puntero)
  document.addEventListener('pointermove', e => {
    if (readingGuide && body.classList.contains('guide-enabled')) {
      readingGuide.style.insetBlockStart = `${e.clientY + 12}px`;
    }
  });

  // Teclado global
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && a11yPanel && !a11yPanel.hidden) {
      closeA11yPanel();
    }
    if (e.altKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      openA11yPanel();
    }
  });
}
