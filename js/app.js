'use strict';
// ============================================================
// app.js - Módulo principal de inicialización
// Coordina la carga de todos los módulos de la aplicación.
// ============================================================

import { loadSettings } from './settings.js';
import { initA11yPanel } from './a11y-panel.js';
import { initNavigation } from './navigation.js';
import { initCart } from './cart.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const root = document.documentElement;

  // 1. Cargar preferencias de accesibilidad
  loadSettings(body, root);

  // 2. Inicializar panel de accesibilidad
  initA11yPanel();

  // 3. Inicializar navegación y menú
  initNavigation();

  // 4. Inicializar carrito de compras
  initCart();

  // 5. Inicializar validación y envío de formulario
  initForm();
});
