'use strict';
// ============================================================
// MÓDULO: announce.js
// Utilidades de comunicación accesible: live region y toast
// ============================================================

const liveRegion = document.getElementById('liveRegion');
const toast = document.getElementById('toast');

export function announce(message) {
  if (!liveRegion) return;
  liveRegion.textContent = '';
  window.setTimeout(() => { liveRegion.textContent = message; }, 40);
}

export function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => { toast.hidden = true; }, 4300);
}
