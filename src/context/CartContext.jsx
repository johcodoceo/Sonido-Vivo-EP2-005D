import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useProducts } from './ProductContext.jsx';
import { ROLES } from '../utils/roles.js';
import {
  addToCart, cartSummary, normalizeCart, readCart, removeFromCart,
  sameCart, saveCart, setCartQuantity,
} from '../services/cartRepository.js';

const CartContext = createContext(null);

function CartProvider({ userId, canShop, children }) {
  const { products } = useProducts();
  const [items, setItems] = useState(() => readCart(userId, products));
  const [storageError, setStorageError] = useState('');
  const [adjustmentNotice, setAdjustmentNotice] = useState('');

  const persist = useCallback((next) => {
    setItems(next);
    try {
      saveCart(userId, next);
      setStorageError('');
    } catch {
      setStorageError('No pudimos guardar el carrito en este navegador; podría perderse al recargar.');
    }
  }, [userId]);

  // Si un vendedor cambia stock o el administrador elimina un artículo, no se
  // puede conservar una cantidad superior a la disponibilidad del catálogo.
  useEffect(() => {
    const adjusted = normalizeCart(items, products);
    if (!sameCart(items, adjusted)) {
      persist(adjusted);
      setAdjustmentNotice('El carrito se ajustó porque cambió el stock o se eliminó un producto.');
    }
  }, [items, products, persist]);

  const addItem = useCallback((productId, quantity = 1) => {
    if (!canShop) return 'Este rol no tiene acceso al carrito.';
    const result = addToCart(normalizeCart(items, products), productId, products, quantity);
    if (!result.error) { persist(result.items); setAdjustmentNotice(''); }
    return result.error;
  }, [items, products, persist, canShop]);

  const changeQuantity = useCallback((productId, quantity) => {
    if (!canShop) return 'Este rol no tiene acceso al carrito.';
    const result = setCartQuantity(normalizeCart(items, products), productId, quantity, products);
    if (!result.error) { persist(result.items); setAdjustmentNotice(''); }
    return result.error;
  }, [items, products, persist, canShop]);

  const removeItem = useCallback((productId) => {
    if (!canShop) return;
    persist(removeFromCart(items, productId));
    setAdjustmentNotice('');
  }, [canShop, items, persist]);

  const clearCart = useCallback(() => {
    if (!canShop) return;
    persist([]);
    setAdjustmentNotice('');
  }, [canShop, persist]);

  // Sincroniza React cuando la confirmación ya vació el carrito persistido.
  const replaceAfterOrder = useCallback(() => { setItems([]); setStorageError(''); setAdjustmentNotice(''); }, []);

  const summary = useMemo(() => cartSummary(normalizeCart(items, products), products), [items, products]);
  const value = useMemo(() => ({
    ...summary, canShop, storageError, adjustmentNotice,
    addItem, changeQuantity, removeItem, clearCart, replaceAfterOrder,
  }), [summary, canShop, storageError, adjustmentNotice, addItem, changeQuantity, removeItem, clearCart, replaceAfterOrder]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Un cambio de usuario crea un contexto nuevo, sin mostrar el carrito del rol anterior. */
export function CartSessionProvider({ children }) {
  const { user } = useAuth();
  const canShop = user?.role === ROLES.CLIENTE || user?.role === ROLES.ADMIN;
  return <CartProvider key={user?.id ?? 'sin-sesion'} userId={user?.id ?? null} canShop={canShop}>
    {children}
  </CartProvider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe estar dentro de CartSessionProvider');
  return context;
}

// Permite representar ProductCard de forma aislada en pruebas y en Storybook.
export function useOptionalCart() {
  return useContext(CartContext);
}
