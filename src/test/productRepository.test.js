import { describe, expect, it, vi } from 'vitest';
import { initialProducts } from '../data/products.js';
import { createProduct, deleteProduct, filterProducts, formatCLP, PRODUCTS_STORAGE_KEY, readProducts, saveProducts, updateProduct, updateStock, validateProduct } from '../services/productRepository.js';

const valid = { name:'Guitarra acústica nueva', brand:'Marca Demo', model:'Modelo 001', categorySlug:'guitarras-acusticas', description:'Instrumento para demostración académica.', price:120000, stock:4 };

describe('Catálogo de Sonido Vivo (Excel oficial Forma B)', () => {
  it('busca productos por modelo', () => {
    const found = filterProducts(initialProducts, { query: 'SM58' });
    expect(found).toHaveLength(1); expect(found[0].id).toBe('MI001');
  });
  it('filtra productos por categoría', () => {
    const found = filterProducts(initialProducts, { categorySlug: 'teclados-y-pianos' });
    expect(found).toHaveLength(4);
    expect(found.every((product) => product.categorySlug === 'teclados-y-pianos')).toBe(true);
  });
  it('excluye agotados en modo solo disponibles', () => {
    const found = filterProducts(initialProducts, { availableOnly: true });
    expect(found.every((product) => product.stock > 0)).toBe(true);
    expect(found).toHaveLength(initialProducts.filter((p) => p.stock > 0).length);
  });
  it('ordena por precio de menor a mayor sin mutar el original', () => {
    const originalFirst = initialProducts[0].id;
    const found = filterProducts(initialProducts, { sort: 'price-asc' });
    expect(found[0].price).toBe(Math.min(...initialProducts.map((p) => p.price)));
    expect(initialProducts[0].id).toBe(originalFirst);
  });
  it('valida campos obligatorios, precio y stock', () => {
    const result = validateProduct({ ...valid, name: 'A', price: -10, stock: 2.5 });
    expect(result.errors).toHaveProperty('name');
    expect(result.errors).toHaveProperty('price');
    expect(result.errors).toHaveProperty('stock');
  });
  it('detecta nombres duplicados', () => {
    const result = validateProduct({ ...valid, name: initialProducts[0].name.toUpperCase() }, initialProducts);
    expect(result.errors.name).toMatch(/ya existe/i);
  });
  it('crea un producto válido con código único', () => {
    const result = createProduct(initialProducts, valid);
    expect(result.errors).toEqual({});
    expect(result.products).toHaveLength(initialProducts.length + 1);
    expect(result.products.at(-1).id).toBe('SV-001');
  });
  it('impide crear un producto inválido', () => {
    const result = createProduct(initialProducts, { ...valid, stock: -1 });
    expect(result.products).toBe(initialProducts);
    expect(result.errors).toHaveProperty('stock');
  });
  it('actualiza solo el producto indicado', () => {
    const first = initialProducts[0];
    const result = updateProduct(initialProducts, first.id, { ...first, name:'Nueva guitarra eléctrica' });
    expect(result.errors).toEqual({});
    expect(result.products[0].name).toBe('Nueva guitarra eléctrica');
    expect(result.products[1]).toBe(initialProducts[1]);
  });
  it('elimina el producto elegido sin modificar el arreglo original', () => {
    const result = deleteProduct(initialProducts, 'GA001');
    expect(result).toHaveLength(initialProducts.length - 1);
    expect(result.some((item) => item.id === 'GA001')).toBe(false);
    expect(initialProducts).toHaveLength(51);
  });
  it('el vendedor ajusta el stock a cero sin afectar precio', () => {
    const result = updateStock(initialProducts, 'GA001', 0);
    expect(result.error).toBe(null);
    expect(result.products[0].stock).toBe(0);
    expect(result.products[0].price).toBe(initialProducts[0].price);
  });
  it('rechaza stock negativo', () => {
    const result = updateStock(initialProducts, 'GA001', -1);
    expect(result.error).toMatch(/entero/i);
    expect(result.products).toBe(initialProducts);
  });
  it('guarda y recupera cambios de localStorage', () => {
    const storage = { getItem: vi.fn(), setItem: vi.fn() };
    saveProducts(initialProducts, storage);
    expect(storage.setItem).toHaveBeenCalledWith(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    storage.getItem.mockReturnValue(JSON.stringify(initialProducts));
    expect(readProducts(storage)).toEqual(initialProducts);
  });
  it('recupera datos iniciales si el almacenamiento está corrupto', () => {
    const storage = { getItem: () => '{incompleto' };
    expect(readProducts(storage)).toEqual(initialProducts);
  });
  it('da formato de moneda chilena al precio', () => {
    expect(formatCLP(120000)).toMatch(/120[.\s]000/);
  });
});


describe('Integridad de importación del Excel Forma B', () => {
  it('contiene exactamente 51 fichas identificables sin códigos repetidos', () => {
    expect(initialProducts).toHaveLength(51);
    expect(new Set(initialProducts.map(p => p.id)).size).toBe(51);
  });
  it('conserva los datos de la primera y última ficha original', () => {
    expect(initialProducts[0]).toEqual(expect.objectContaining({ id:'GA001', name:'Guitarra Acústica Folk', brand:'Yamaha', model:'F310', stock:8, price:129990 }));
    expect(initialProducts.at(-1)).toEqual(expect.objectContaining({ id:'ES005', name:'Pop Filter para Micrófono', brand:'Sennheiser', model:'MZP 40', stock:8, price:14990 }));
  });
  it('permite buscar por modelo y por código del Excel', () => {
    expect(filterProducts(initialProducts, {query:'F310'}).map(p=>p.id)).toContain('GA001');
    expect(filterProducts(initialProducts, {query:'ES005'}).map(p=>p.id)).toEqual(['ES005']);
  });
});
