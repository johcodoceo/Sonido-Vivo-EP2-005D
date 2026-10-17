import { describe, it, expect, vi } from 'vitest';
import { initialProducts } from '../data/products.js';
import { updateStock, deleteProduct } from '../services/productRepository.js';
import {
  cartStorageKey, normalizeCart, readCart, saveCart, addToCart,
  setCartQuantity, removeFromCart, cartSummary, sameCart,
} from '../services/cartRepository.js';

const products = initialProducts;
const first = products[0];
const second = products[1];
const line = (quantity = 1) => [{ productId: first.id, quantity }];

function storageDouble() {
  const map = new Map();
  return {
    getItem: vi.fn((key) => map.get(key) ?? null),
    setItem: vi.fn((key, value) => map.set(key, value)),
    map,
  };
}

describe('CartRepository - carrito de Sonido Vivo', () => {
  it('agrega un producto válido del Excel Forma B', () => {
    const result = addToCart([], first.id, products);
    expect(result).toEqual({ items: line(), error: null });
  });
  it('acumula la cantidad sin crear líneas duplicadas', () => {
    const result = addToCart(line(), first.id, products, 2);
    expect(result.items).toEqual(line(3));
  });
  it('no permite exceder el stock real', () => {
    const result = addToCart([], first.id, products, first.stock + 1);
    expect(result.error).toMatch(/solo hay/i);
    expect(result.items).toEqual([]);
  });
  it('bloquea productos sin stock', () => {
    const noStock = products.map((product) => product.id === first.id ? { ...product, stock: 0 } : product);
    expect(addToCart([], first.id, noStock).error).toMatch(/agotado/i);
  });
  it('rechaza producto inexistente', () => {
    expect(addToCart([], 'NO-EXISTE', products).error).toMatch(/no existe/i);
  });
  it.each([0, -2, 1.5, NaN, Infinity])('rechaza cantidades no válidas: %s', (quantity) => {
    expect(addToCart([], first.id, products, quantity).error).toMatch(/cantidad/i);
  });
  it('permite fijar la cantidad dentro del stock', () => {
    expect(setCartQuantity(line(), first.id, 2, products).items).toEqual(line(2));
  });
  it('impide fijar una cantidad superior al stock', () => {
    const result = setCartQuantity(line(), first.id, first.stock + 1, products);
    expect(result.items).toEqual(line());
    expect(result.error).toMatch(/solo hay/i);
  });
  it('no admite cantidades cero o fraccionarias en edición', () => {
    expect(setCartQuantity(line(), first.id, 0, products).error).toMatch(/cantidad/i);
    expect(setCartQuantity(line(), first.id, 2.4, products).error).toMatch(/cantidad/i);
  });
  it('elimina solo la línea solicitada', () => {
    const both = [...line(), { productId: second.id, quantity: 1 }];
    expect(removeFromCart(both, first.id)).toEqual([{ productId: second.id, quantity: 1 }]);
  });
  it('calcula subtotales y total a partir de precios actualizados', () => {
    const changed = products.map((p) => p.id === first.id ? { ...p, price: first.price + 5000 } : p);
    const result = cartSummary(line(2), changed);
    expect(result.count).toBe(2);
    expect(result.lines[0].lineTotal).toBe(2 * (first.price + 5000));
    expect(result.subtotal).toBe(2 * (first.price + 5000));
  });
  it('ajusta el carrito si vendedor disminuye stock', () => {
    const changed = updateStock(products, first.id, 1).products;
    expect(normalizeCart(line(5), changed)).toEqual(line(1));
  });
  it('quita productos eliminados y agotados', () => {
    const both = [...line(), { productId: second.id, quantity: 1 }];
    const changed = deleteProduct(products, first.id).map((p) => p.id === second.id ? { ...p, stock: 0 } : p);
    expect(normalizeCart(both, changed)).toEqual([]);
  });
  it('limpia valores corruptos y une líneas duplicadas sin exceder existencias', () => {
    const raw = [...line(first.stock), ...line(9), { productId: 'FALSO', quantity: 1 }, { productId: first.id, quantity: -9 }, null];
    expect(normalizeCart(raw, products)).toEqual(line(first.stock));
  });
  it('reconoce cuándo dos listas de carrito coinciden', () => {
    expect(sameCart(line(1), line(1))).toBe(true);
    expect(sameCart(line(1), line(2))).toBe(false);
  });
  it('guarda y recupera carrito desde localStorage de un usuario', () => {
    const storage = storageDouble();
    saveCart('demo-cliente', line(2), storage);
    expect(storage.map.get(cartStorageKey('demo-cliente'))).toContain(first.id);
    expect(readCart('demo-cliente', products, storage)).toEqual(line(2));
  });
  it('corrige el valor almacenado si el stock bajó desde la visita anterior', () => {
    const storage = storageDouble();
    saveCart('demo-cliente', line(5), storage);
    const current = products.map((p) => p.id === first.id ? { ...p, stock: 2 } : p);
    expect(readCart('demo-cliente', current, storage)).toEqual(line(2));
    expect(JSON.parse(storage.map.get(cartStorageKey('demo-cliente')))).toEqual(line(2));
  });
  it('mantiene separados los carritos de cliente y administrador', () => {
    const storage = storageDouble();
    saveCart('demo-cliente', line(), storage);
    expect(readCart('demo-administrador', products, storage)).toEqual([]);
  });
  it('tolera almacenamiento corrupto o no disponible', () => {
    const storage = storageDouble();
    storage.map.set(cartStorageKey('demo-cliente'), '{no-json');
    expect(readCart('demo-cliente', products, storage)).toEqual([]);
    const broken = { getItem: () => { throw new Error('bloqueado'); } };
    expect(readCart('demo-cliente', products, broken)).toEqual([]);
  });
});
