import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createProduct, deleteProduct, readProducts, saveProducts, updateProduct, updateStock } from '../services/productRepository.js';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => readProducts());
  const [storageError, setStorageError] = useState('');

  const persist = useCallback((next) => {
    setProducts(next);
    try { saveProducts(next); setStorageError(''); }
    catch { setStorageError('No se pudo guardar en este navegador. Los cambios podrían perderse al recargar.'); }
  }, []);

  const addProduct = useCallback((data) => {
    const result = createProduct(products, data);
    if (!Object.keys(result.errors).length) persist(result.products);
    return result.errors;
  }, [products, persist]);

  const editProduct = useCallback((id, data) => {
    const result = updateProduct(products, id, data);
    if (!Object.keys(result.errors).length) persist(result.products);
    return result.errors;
  }, [products, persist]);

  const removeProduct = useCallback((id) => {
    persist(deleteProduct(products, id));
  }, [products, persist]);

  const setStock = useCallback((id, stock) => {
    const result = updateStock(products, id, stock);
    if (!result.error) persist(result.products);
    return result.error;
  }, [products, persist]);

  const value = useMemo(() => ({ products, storageError, addProduct, editProduct, removeProduct, setStock }),
    [products, storageError, addProduct, editProduct, removeProduct, setStock]);
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts debe estar dentro de ProductProvider');
  return context;
}
