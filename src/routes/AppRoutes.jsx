import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { ROLES } from '../utils/roles.js';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import CatalogPage from '../pages/CatalogPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import OrdersPage from '../pages/OrdersPage.jsx';
import LocationsPage from '../pages/LocationsPage.jsx';
import SellerPage from '../pages/SellerPage.jsx';
import AdminPage from '../pages/AdminPage.jsx';
import ForbiddenPage from '../pages/ForbiddenPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

const clientRoles = [ROLES.CLIENTE, ROLES.ADMIN];
const staffRoles = [ROLES.VENDEDOR, ROLES.ADMIN];

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/ingresar" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/ubicaciones" element={<LocationsPage />} />
          <Route path="/sin-acceso" element={<ForbiddenPage />} />

          <Route element={<ProtectedRoute allowedRoles={clientRoles} />}>
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/mis-pedidos" element={<OrdersPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={staffRoles} />}>
            <Route path="/vendedor" element={<SellerPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/administracion" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
