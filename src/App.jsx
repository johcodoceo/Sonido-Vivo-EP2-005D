import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CartSessionProvider } from './context/CartContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { OrderProvider } from './context/OrderContext.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider><AuthProvider>
        <ProductProvider>
          <CartSessionProvider><OrderProvider><AppRoutes /></OrderProvider></CartSessionProvider>
        </ProductProvider>
      </AuthProvider></UserProvider>
    </BrowserRouter>
  );
}
