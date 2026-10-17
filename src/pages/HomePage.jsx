import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLE_LABELS, ROLES } from '../utils/roles.js';
import { categories } from '../data/categories.js';
import CategoryCard from '../components/CategoryCard.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import DemoDataNotice from '../components/DemoDataNotice.jsx';

export default function HomePage() {
  const { user } = useAuth();
  const { products } = useProducts();
  return (
    <>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-4 py-lg-4">
            <div className="col-lg-7">
              <div className="eyebrow mb-3">SONIDO VIVO · FORMA B</div>
              <h1 className="hero-heading mb-3">La música comienza <span className="gradient-text">aquí.</span></h1>
              <p className="hero-description mb-4">Explora instrumentos, equipos de sonido y accesorios. Estamos construyendo una experiencia de compra más sencilla para la tienda de Viña del Mar.</p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-warning btn-lg fw-semibold px-4" to="/catalogo">Explorar categorías <span aria-hidden="true">→</span></Link>
                <Link className="btn btn-outline-light btn-lg px-4" to="/ubicaciones">Ubicaciones</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-showcase" aria-label="Sonido Vivo, tienda musical">
                <span className="showcase-ring ring-a"/><span className="showcase-ring ring-b"/>
                <span className="showcase-note note-one" aria-hidden="true">♫</span>
                <span className="showcase-note note-two" aria-hidden="true">♪</span>
                <div className="showcase-center"><span aria-hidden="true">🎸</span><strong>ENCUENTRA<br/>TU SONIDO</strong></div>
                <div className="showcase-sticker">ETAPA 2 · CATÁLOGO</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
          <div><div className="eyebrow mb-2">CATEGORÍAS</div><h2 className="section-heading mb-1">Encuentra lo que necesitas</h2><p className="text-secondary mb-0">Explora las 10 categorías informadas en el catálogo académico de Sonido Vivo.</p></div>
          <Link to="/catalogo" className="text-link">Ir al catálogo →</Link>
        </div>
        <div className="row g-3">{categories.map((category) => <div className="col-12 col-sm-6 col-lg-4" key={category.slug}><CategoryCard category={category} /></div>)}</div>
      </section>
      <section className="container pb-5">
        <div className="d-flex justify-content-between align-items-end mb-3"><div><div className="eyebrow mb-1">PRODUCTOS DEL CATÁLOGO</div><h2 className="section-heading mb-0">Instrumentos destacados</h2></div><Link className="text-link" to="/catalogo">Ver todos →</Link></div>
        <DemoDataNotice />
        <div className="row g-3">{products.filter((p) => p.stock > 0).slice(0, 3).map((item) => <div className="col-md-4" key={item.id}><ProductCard product={item}/></div>)}</div>
      </section>
      <section className="container pb-5">
        <div className="welcome-strip d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div><div className="eyebrow mb-2">MODO DEMOSTRACIÓN</div><h2 className="h4 fw-bold mb-1">Sesión: {ROLE_LABELS[user.role]}</h2><p className="text-secondary mb-0">Navegación por roles implementada en el frontend. Los datos y permisos reales se agregarán más adelante.</p></div>
          {user.role === ROLES.CLIENTE && <Link to="/carrito" className="btn btn-dark">Ir a mi carrito</Link>}
          {user.role === ROLES.VENDEDOR && <Link to="/vendedor" className="btn btn-dark">Área vendedor</Link>}
          {user.role === ROLES.ADMIN && <Link to="/administracion" className="btn btn-dark">Panel administrador</Link>}
        </div>
      </section>
    </>
  );
}
