'use strict';
// ============================================================
// MÓDULO: form.js
// Validación accesible del formulario y envío a WhatsApp
// ============================================================
import { announce } from './announce.js';
import { showToast } from './announce.js';
import { getCartSummaryText } from './cart.js';

const WA_NUMBER = '573125108134';

const errorMap = {
  fullName:      'fullNameError',
  phone:         'phoneError',
  requestType:   'requestTypeError',
  pizzaChoice:   'pizzaChoiceError',
  preferredDate: 'dateError',
  consent:       'consentError'
};

function validateField(field) {
  const errorEl = document.getElementById(errorMap[field.id]);
  if (!errorEl) return field.checkValidity();
  const invalid = !field.checkValidity();
  field.setAttribute('aria-invalid', String(invalid));
  errorEl.classList.toggle('visible', invalid);
  return !invalid;
}

function buildWhatsAppMessage(data) {
  const pizzaLine = data.cartSummary
    ? `- Pizzas: ${data.cartSummary}`
    : `- Pizza preferida: ${data.pizzaChoice}`;

  return [
    '¡Hola Horno Vivo! Quiero realizar una solicitud:',
    `- Nombre: ${data.fullName}`,
    `- Teléfono: ${data.phone}`,
    `- Tipo: ${data.requestType}`,
    pizzaLine,
    `- Fecha: ${data.preferredDate}`,
    `- Canal de confirmación: ${data.contactMethod}`,
    data.message ? `- Notas/Alergias: ${data.message}` : ''
  ].filter(Boolean).join('\n');
}

export function initForm() {
  const form       = document.getElementById('orderForm');
  const formAlert  = document.getElementById('formAlert');
  const dateInput  = document.getElementById('preferredDate');

  if (!form) return;

  // Fecha mínima = hoy
  if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString().split('T')[0];
  }

  // Validación en tiempo real campo por campo
  const requiredFields = [...form.querySelectorAll('[required]')];
  requiredFields.forEach(field => {
    field.addEventListener('blur',   () => validateField(field));
    field.addEventListener('change', () => validateField(field));
  });

  // Envío del formulario
  form.addEventListener('submit', event => {
    event.preventDefault();

    const invalidFields = requiredFields.filter(f => !validateField(f));

    if (invalidFields.length) {
      if (formAlert) { formAlert.classList.add('visible'); formAlert.focus(); }
      announce(`El formulario contiene ${invalidFields.length} campo${invalidFields.length > 1 ? 's' : ''} por corregir.`);
      invalidFields[0].focus();
      return;
    }

    // Recolectar datos
    const getValue = id => (document.getElementById(id)?.value ?? '').trim();
    const cartSummary = getCartSummaryText();

    const data = {
      fullName:      getValue('fullName'),
      phone:         getValue('phone'),
      requestType:   getValue('requestType'),
      pizzaChoice:   getValue('pizzaChoice'),
      preferredDate: getValue('preferredDate'),
      contactMethod: getValue('contactMethod'),
      message:       getValue('message'),
      cartSummary,
    };

    const message = buildWhatsAppMessage(data);
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    // Limpiar formulario
    if (formAlert) formAlert.classList.remove('visible');
    form.reset();
    requiredFields.forEach(f => f.setAttribute('aria-invalid', 'false'));

    // Abrir WhatsApp
    window.open(url, '_blank', 'noopener');
    showToast('Redirigiendo a WhatsApp para enviar tu solicitud…');
    announce('Solicitud enviada. Redirigiendo a WhatsApp.');
  });
}
