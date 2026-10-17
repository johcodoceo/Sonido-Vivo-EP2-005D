import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import SiteFooter from './SiteFooter.jsx';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="contenido" className="flex-grow-1"><Outlet /></main>
      <SiteFooter />
    </div>
  );
}
