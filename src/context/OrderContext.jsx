import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useCart } from './CartContext.jsx';
import { useProducts } from './ProductContext.jsx';
import { ROLES } from '../utils/roles.js';
import { commitDemoOrder, commitStatusTransition, readOrders } from '../services/orderRepository.js';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const { lines, replaceAfterOrder } = useCart();
  const { replaceAfterOrder: syncStock } = useProducts();
  const [orders, setOrders] = useState(readOrders);

  const placeOrder = useCallback((form) => {
    if (![ROLES.CLIENTE, ROLES.ADMIN].includes(user?.role)) return { error: 'No tienes permiso para comprar.', errors: {} };
    const result = commitDemoOrder(user.id, lines.map(({ productId, quantity }) => ({ productId, quantity })), form, undefined, undefined, user.role);
    if (!result.error) {
      syncStock(result.updatedProducts);
      replaceAfterOrder();
      setOrders(result.updatedOrders);
    }
    return result;
  }, [user, lines, syncStock, replaceAfterOrder]);

  const advanceOrder = useCallback((id, nextStatus) => {
    if (![ROLES.VENDEDOR, ROLES.ADMIN].includes(user?.role)) return 'Tu rol no puede actualizar pedidos.';
    const result = commitStatusTransition(id, nextStatus);
    if (!result.error) setOrders(result.orders);
    return result.error;
  }, [user]);

  const mine = useMemo(() => orders.filter((order) => order.userId === user?.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [orders, user]);
  const all = useMemo(() => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [orders]);
  const value = useMemo(() => ({ orders: all, mine, placeOrder, advanceOrder }), [all, mine, placeOrder, advanceOrder]);
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders necesita OrderProvider');
  return context;
}
