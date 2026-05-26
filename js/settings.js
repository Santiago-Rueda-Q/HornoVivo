'use strict';
// ============================================================
// MÓDULO: settings.js
// Gestión de preferencias de accesibilidad en localStorage
// ============================================================

export const preferenceKey = 'HornoVivoAccessibility';

export const allowedClasses = [
  'high-contrast', 'grayscale', 'pause-motion', 'focus-strong',
  'guide-enabled', 'readable-font', 'wide-spacing', 'hide-images', 'big-cursor'
];

export let settings = { fontScale: 100, theme: 'light', classes: [] };

export function setSettings(newSettings) {
  settings = newSettings;
}

export function saveSettings() {
  try { localStorage.setItem(preferenceKey, JSON.stringify(settings)); } catch (e) {}
}

export function applySettings(body, root) {
  allowedClasses.forEach(item => body.classList.toggle(item, settings.classes.includes(item)));
  root.dataset.theme = settings.theme;
  root.style.setProperty('--font-scale', String(settings.fontScale / 100));
  saveSettings();
}

export function loadSettings(body, root) {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    if (saved && typeof saved === 'object') settings = { ...settings, ...saved };
  } catch (e) {}
  applySettings(body, root);
}
