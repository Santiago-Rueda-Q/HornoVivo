'use strict';

const body = document.body;
const root = document.documentElement;
const liveRegion = document.getElementById('liveRegion');
const toast = document.getElementById('toast');
const preferenceKey = 'HornoVivoAccessibility';
const allowedClasses = [
  'high-contrast', 'grayscale', 'pause-motion', 'focus-strong',
  'guide-enabled', 'readable-font', 'wide-spacing', 'hide-images', 'big-cursor'
];

let settings = { fontScale: 100, theme: 'light', classes: [] };

function announce(message) {
  liveRegion.textContent = '';
  window.setTimeout(() => { liveRegion.textContent = message; }, 40);
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 4300);
}

function saveSettings() {
  try { localStorage.setItem(preferenceKey, JSON.stringify(settings)); } catch (error) {}
}

function updatePressedStates() {
  document.querySelectorAll('[data-toggle]').forEach(button => {
    button.setAttribute('aria-pressed', String(body.classList.contains(button.dataset.toggle)));
  });
  document.querySelector('[data-theme-toggle]')
    .setAttribute('aria-pressed', String(settings.theme === 'dark'));
}

function applySettings() {
  allowedClasses.forEach(item => body.classList.toggle(item, settings.classes.includes(item)));
  root.dataset.theme = settings.theme;
  root.style.setProperty('--font-scale', String(settings.fontScale / 100));
  updatePressedStates();
  saveSettings();
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(preferenceKey));
    if (saved && typeof saved === 'object') settings = { ...settings, ...saved };
  } catch (error) {}
  applySettings();
}

/* Navegación responsive y menú desplegable accesible */
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const productsButton = document.getElementById('productsButton');
const productsMenu = document.getElementById('productsMenu');

function closeMobileMenu() {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú principal');
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú principal' : 'Abrir menú principal');
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

document.addEventListener('click', event => {
  if (productsButton && productsMenu && !event.target.closest('.nav-dropdown')) {
    productsButton.setAttribute('aria-expanded', 'false');
    productsMenu.hidden = true;
    productsMenu.classList.remove('open');
  }
});

if (mainNav) {
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
}

/* Tarjetas dinámicas del pedido con anuncio accesible */
let cartTotal = 0;
const cartCount = document.getElementById('cartCount');
document.querySelectorAll('.add-order').forEach(button => {
  button.addEventListener('click', () => {
    cartTotal += 1;
    if (cartCount) {
      cartCount.value = String(cartTotal);
      cartCount.textContent = String(cartTotal);
    }
    const product = button.dataset.product;
    showToast(`${product} agregado al pedido.`);
    announce(`${product} agregado. Ahora tienes ${cartTotal} productos en el pedido.`);
  });
});

/* Acordeones con estados ARIA */
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    if (panel) panel.hidden = expanded;
  });
});

/* Modal accesible basado en dialog */
const infoModal = document.getElementById('infoModal');
const openInfoModal = document.getElementById('openInfoModal');
const closeInfoModal = document.getElementById('closeInfoModal');
const modalAccept = document.getElementById('modalAccept');

if (openInfoModal && infoModal) {
  openInfoModal.addEventListener('click', () => {
    infoModal.showModal();
    if (closeInfoModal) closeInfoModal.focus();
  });
}

function closeModal() {
  if (infoModal) {
    infoModal.close();
    if (openInfoModal) openInfoModal.focus();
  }
}

if (closeInfoModal) closeInfoModal.addEventListener('click', closeModal);
if (modalAccept) modalAccept.addEventListener('click', closeModal);
if (infoModal) {
  infoModal.addEventListener('click', event => {
    const box = infoModal.getBoundingClientRect();
    const isInside = event.clientX >= box.left && event.clientX <= box.right &&
                     event.clientY >= box.top && event.clientY <= box.bottom;
    if (!isInside) closeModal();
  });
}

/* Formulario con errores vinculados y redirección a WhatsApp */
const form = document.getElementById('orderForm');
const formAlert = document.getElementById('formAlert');
const dateInput = document.getElementById('preferredDate');

if (dateInput) {
  const today = new Date();
  dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().split('T')[0];
}

const errorMap = {
  fullName: 'fullNameError',
  phone: 'phoneError',
  requestType: 'requestTypeError',
  pizzaChoice: 'pizzaChoiceError',
  preferredDate: 'dateError',
  consent: 'consentError'
};

function validateField(field) {
  const error = document.getElementById(errorMap[field.id]);
  if (!error) return field.checkValidity();
  const invalid = !field.checkValidity();
  field.setAttribute('aria-invalid', String(invalid));
  error.classList.toggle('visible', invalid);
  return !invalid;
}

if (form) {
  const requiredFields = [...form.querySelectorAll('[required]')];
  
  requiredFields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('change', () => validateField(field));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalidFields = requiredFields.filter(field => !validateField(field));

    if (invalidFields.length) {
      if (formAlert) {
        formAlert.classList.add('visible');
        formAlert.focus();
      }
      announce(`El formulario contiene ${invalidFields.length} campos por corregir.`);
      invalidFields[0].focus();
      return;
    }

    // Extracción de datos para mensaje de WhatsApp
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const requestType = document.getElementById('requestType').value;
    const pizzaChoice = document.getElementById('pizzaChoice').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const contactMethod = document.getElementById('contactMethod').value;
    const message = document.getElementById('message').value.trim();

    const formattedMessage = `¡Hola Horno Vivo! Quiero realizar una solicitud:
- Nombre: ${fullName}
- Teléfono: ${phone}
- Tipo: ${requestType}
- Pizza: ${pizzaChoice}
- Fecha: ${preferredDate}
- Canal de confirmación: ${contactMethod}
${message ? `- Notas/Alergias: ${message}` : ''}`;

    const whatsappUrl = `https://wa.me/573125108134?text=${encodeURIComponent(formattedMessage)}`;

    if (formAlert) formAlert.classList.remove('visible');
    form.reset();
    requiredFields.forEach(field => field.setAttribute('aria-invalid', 'false'));
    
    // Abrir redireccionamiento en nueva pestaña
    window.open(whatsappUrl, '_blank', 'noopener');
    
    showToast('Redirigiendo a WhatsApp para enviar tu solicitud...');
    announce('Solicitud enviada correctamente. Redirigiendo a WhatsApp.');
  });
}

/* Panel de accesibilidad complementario */
const a11yLauncher = document.getElementById('a11yLauncher');
const a11yPanel = document.getElementById('a11yPanel');
const closeA11y = document.getElementById('closeA11y');

function openA11yPanel() {
  if (a11yPanel && a11yLauncher && closeA11y) {
    a11yPanel.hidden = false;
    a11yLauncher.setAttribute('aria-expanded', 'true');
    closeA11y.focus();
  }
}

function closeA11yPanel() {
  if (a11yPanel && a11yLauncher) {
    a11yPanel.hidden = true;
    a11yLauncher.setAttribute('aria-expanded', 'false');
    a11yLauncher.focus();
  }
}

if (a11yLauncher && a11yPanel) {
  a11yLauncher.addEventListener('click', () => {
    if (a11yPanel.hidden) openA11yPanel(); else closeA11yPanel();
  });
}
if (closeA11y) closeA11y.addEventListener('click', closeA11yPanel);

document.querySelectorAll('[data-toggle]').forEach(button => {
  button.addEventListener('click', () => {
    const className = button.dataset.toggle;
    const active = settings.classes.includes(className);
    settings.classes = active
      ? settings.classes.filter(item => item !== className)
      : [...settings.classes, className];
    applySettings();
    announce(`${button.textContent.trim()} ${active ? 'desactivado' : 'activado'}.`);
  });
});

const themeToggle = document.querySelector('[data-theme-toggle]');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    applySettings();
    announce(`Modo ${settings.theme === 'dark' ? 'oscuro' : 'claro'} activado.`);
  });
}

function changeFont(delta) {
  settings.fontScale = Math.max(90, Math.min(140, settings.fontScale + delta));
  applySettings();
  announce(`Tamaño de texto al ${settings.fontScale} por ciento.`);
}

const fontIncrease = document.getElementById('fontIncrease');
const fontDecrease = document.getElementById('fontDecrease');
const fontReset = document.getElementById('fontReset');

if (fontIncrease) fontIncrease.addEventListener('click', () => changeFont(10));
if (fontDecrease) fontDecrease.addEventListener('click', () => changeFont(-10));
if (fontReset) {
  fontReset.addEventListener('click', () => {
    settings.fontScale = 100;
    applySettings();
    announce('Tamaño de texto restablecido.');
  });
}

document.querySelectorAll('[data-profile]').forEach(button => {
  button.addEventListener('click', () => {
    const profiles = {
      cognitive: ['readable-font', 'wide-spacing', 'pause-motion'],
      lowVision: ['high-contrast', 'focus-strong', 'big-cursor'],
      motor: ['focus-strong', 'big-cursor', 'pause-motion']
    };
    settings.classes = [...new Set([...settings.classes, ...profiles[button.dataset.profile]])];
    if (button.dataset.profile === 'lowVision') settings.fontScale = 120;
    applySettings();
    announce(`${button.textContent.trim()} activado.`);
  });
});

const resetAccessibility = document.getElementById('resetAccessibility');
if (resetAccessibility) {
  resetAccessibility.addEventListener('click', () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    settings = { fontScale: 100, theme: 'light', classes: [] };
    applySettings();
    showToast('Ajustes de accesibilidad restablecidos.');
  });
}

const readingGuide = document.getElementById('readingGuide');
document.addEventListener('pointermove', event => {
  if (readingGuide && body.classList.contains('guide-enabled')) {
    readingGuide.style.insetBlockStart = `${event.clientY + 12}px`;
  }
});

const speakButton = document.getElementById('speakPage');
let speaking = false;
if (speakButton) {
  speakButton.addEventListener('click', () => {
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

    const mainElement = document.querySelector('main');
    const text = mainElement ? mainElement.innerText : '';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CO';
    utterance.onend = () => {
      speaking = false;
      speakButton.setAttribute('aria-pressed', 'false');
    };
    speaking = true;
    speakButton.setAttribute('aria-pressed', 'true');
    window.speechSynthesis.speak(utterance);
    announce('Lectura iniciada. Pulsa nuevamente para detener.');
  });
}

const keyboardHelp = document.getElementById('keyboardHelp');
if (keyboardHelp) {
  keyboardHelp.addEventListener('click', () => {
    closeA11yPanel();
    if (infoModal) {
      infoModal.showModal();
      if (closeInfoModal) closeInfoModal.focus();
    }
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeA11yPanel();
    if (productsButton && productsMenu) {
      productsButton.setAttribute('aria-expanded', 'false');
      productsMenu.hidden = true;
      productsMenu.classList.remove('open');
    }
    closeMobileMenu();
  }
  if (event.altKey && event.key.toLowerCase() === 'a') {
    event.preventDefault();
    openA11yPanel();
  }
});

loadSettings();
