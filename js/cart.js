'use strict';
// ============================================================
// MÓDULO: cart.js
// Carrito de pedidos: agrega ítems, sincroniza con el formulario
// ============================================================
import { announce } from './announce.js';
import { showToast } from './announce.js';

// Estado interno del carrito: { nombre: cantidad }
const cartItems = {};

// Referencias al DOM del formulario (pueden no existir en carga)
const getChoiceField    = () => document.getElementById('pizzaChoiceField');
const getSelectedField  = () => document.getElementById('selectedPizzasField');
const getSelectedList   = () => document.getElementById('selectedPizzasList');
const getCartCount      = () => document.getElementById('cartCount');
const getPizzaChoice    = () => document.getElementById('pizzaChoice');
const getCartItemsList  = () => document.getElementById('cartItemsList');

/** Devuelve un arreglo legible de los items del carrito */
export function getCartLines() {
  return Object.entries(cartItems).map(([name, qty]) =>
    qty > 1 ? `${name} ×${qty}` : name
  );
}

/** Actualiza el resumen visual dentro del formulario */
function syncFormPizzaField() {
  const choiceField   = getChoiceField();
  const selectedField = getSelectedField();
  const selectedList  = getSelectedList();
  const pizzaChoice   = getPizzaChoice();

  const lines = getCartLines();
  const hasItems = lines.length > 0;

  if (choiceField) {
    choiceField.style.display = hasItems ? 'none' : '';
    if (pizzaChoice) pizzaChoice.required = !hasItems;
  }

  if (selectedField && selectedList) {
    selectedField.style.display = hasItems ? '' : 'none';
    selectedList.innerHTML = lines
      .map(line => `<span style="display:inline-flex;align-items:center;gap:.5rem;">
        <svg class="svg-icon" aria-hidden="true" style="color:var(--color-success);">
          <use href="#icon-check"></use>
        </svg>${line}</span>`)
      .join('');
  }
}

/** Actualiza la lista interactiva de elementos en el menú */
function syncCartList() {
  const container = getCartItemsList();
  if (!container) return;
  
  if (Object.keys(cartItems).length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = Object.entries(cartItems).map(([name, qty]) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="qty">${qty}x</span>
        <span class="name">${name}</span>
      </div>
      <div class="cart-item-actions">
        <button type="button" class="icon-button decrease-item" data-product="${name}" aria-label="Restar 1 ${name}">
          <svg class="svg-icon" aria-hidden="true">
            <use href="#icon-minus"></use>
          </svg>
        </button>
        <button type="button" class="icon-button increase-item" data-product="${name}" aria-label="Sumar 1 ${name}">
          <svg class="svg-icon" aria-hidden="true">
            <use href="#icon-plus"></use>
          </svg>
        </button>
        <button type="button" class="icon-button remove-item" data-product="${name}" aria-label="Eliminar ${name} del pedido completamente">
          <svg class="svg-icon" aria-hidden="true">
            <use href="#icon-close"></use>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
  
  // Asignar eventos
  container.querySelectorAll('.decrease-item').forEach(btn => {
    btn.addEventListener('click', () => removeFromCart(btn.dataset.product));
  });
  container.querySelectorAll('.increase-item').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.product));
  });
  container.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.product;
      delete cartItems[name];
      const total = syncCartCount();
      syncCartList();
      syncFormPizzaField();
      showToast(`${name} eliminado completamente.`);
      announce(`${name} eliminado.`);
    });
  });
}

/** Actualiza el contador visible del carrito */
function syncCartCount() {
  const total = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const el = getCartCount();
  if (el) { el.value = String(total); el.textContent = String(total); }
  return total;
}

/** Agrega 1 unidad del producto al carrito */
export function addToCart(productName) {
  cartItems[productName] = (cartItems[productName] || 0) + 1;
  const total = syncCartCount();
  syncCartList();
  syncFormPizzaField();

  const qty = cartItems[productName];
  const label = qty > 1 ? `${productName} (×${qty})` : productName;
  showToast(`${label} agregado al pedido.`);
  announce(`${label} agregado. Tienes ${total} producto${total !== 1 ? 's' : ''} en el pedido.`);
}

/** Elimina 1 unidad del producto del carrito */
export function removeFromCart(productName) {
  if (!cartItems[productName]) return;
  
  cartItems[productName] -= 1;
  if (cartItems[productName] <= 0) {
    delete cartItems[productName];
  }
  
  const total = syncCartCount();
  syncCartList();
  syncFormPizzaField();
  
  showToast(`1 ${productName} eliminado del pedido.`);
  announce(`${productName} eliminado. Te quedan ${total} producto${total !== 1 ? 's' : ''} en el pedido.`);
}

/** Inicializa los botones "Agregar" de las tarjetas del menú */
export function initCart() {
  document.querySelectorAll('.add-order').forEach(button => {
    button.addEventListener('click', () => addToCart(button.dataset.product));
  });
  // Sincronización inicial por si hay estado previo
  syncCartCount();
  syncCartList();
  syncFormPizzaField();
}

/** Devuelve un string legible de los ítems para el mensaje de WhatsApp */
export function getCartSummaryText() {
  const lines = getCartLines();
  return lines.length ? lines.join(', ') : null;
}
