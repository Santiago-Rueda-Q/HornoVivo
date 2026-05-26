'use strict';
// ============================================================
// MÓDULO: navigation.js
// Menú principal responsive y dropdown de navegación accesible
// ============================================================

const menuToggle = document.getElementById('menuToggle');
const mainNav    = document.getElementById('mainNav');
const productsButton = document.getElementById('productsButton');
const productsMenu   = document.getElementById('productsMenu');

export function closeMobileMenu() {
  if (!mainNav || !menuToggle) return;
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú principal');
}

function closeDropdown() {
  if (!productsButton || !productsMenu) return;
  productsButton.setAttribute('aria-expanded', 'false');
  productsMenu.hidden = true;
  productsMenu.classList.remove('open');
}

export function initNavigation() {
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label',
        isOpen ? 'Cerrar menú principal' : 'Abrir menú principal');
    });
  }

  if (productsButton && productsMenu) {
    productsButton.addEventListener('click', () => {
      const expanded = productsButton.getAttribute('aria-expanded') === 'true';
      productsButton.setAttribute('aria-expanded', String(!expanded));
      productsMenu.hidden = expanded;
      productsMenu.classList.toggle('open', !expanded);
    });
  }

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown')) closeDropdown();
  });

  // Cerrar menú móvil al navegar
  if (mainNav) {
    mainNav.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', closeMobileMenu)
    );
  }

  // Cerrar con Escape
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeDropdown();
      closeMobileMenu();
    }
  });
}
