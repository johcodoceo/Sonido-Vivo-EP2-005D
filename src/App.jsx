import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import { CartSessionProvider } from './context/CartContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartSessionProvider><AppRoutes /></CartSessionProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
