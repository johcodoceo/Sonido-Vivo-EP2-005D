import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import PageIntro from '../components/PageIntro.jsx';
import ProductCard from '../components/ProductCard.jsx';
import DemoDataNotice from '../components/DemoDataNotice.jsx';
import { categories } from '../data/categories.js';
import { filterProducts } from '../services/productRepository.js';

export default function CatalogPage() {
  const { products } = useProducts();
  const [params, setParams] = useSearchParams();
  const category = params.get('categoria') ?? '';
  const query = params.get('buscar') ?? '';
  const sort = params.get('orden') ?? 'name';
  const availableOnly = params.get('disponibles') === 'si';
  const visible = filterProducts(products, { categorySlug: category, query, sort, availableOnly });

  function updateParam(key, value) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    }, { replace: true });
  }

  function resetFilters() { setParams({}); }

  return (
    <section className="container section-space">
      <PageIntro eyebrow="SONIDO VIVO · CATÁLOGO" title="Encuentra tu próximo sonido" description="Explora las 51 fichas detalladas en el catálogo Excel de Forma B. Busca por nombre, marca, modelo o código." />
      <DemoDataNotice />
      <form className="surface-panel p-3 p-md-4 mb-4" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-5">
            <label className="form-label fw-semibold" htmlFor="search-products">Buscar instrumentos</label>
            <input id="search-products" className="form-control" placeholder="Nombre, marca, modelo o código…" value={query} onChange={(event) => updateParam('buscar', event.target.value)} />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <label className="form-label fw-semibold" htmlFor="catalog-category">Categoría</label>
            <select id="catalog-category" className="form-select" value={category} onChange={(event) => updateParam('categoria', event.target.value)}>
              <option value="">Todas las categorías</option>
              {categories.map(({ slug, name }) => <option key={slug} value={slug}>{name}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label fw-semibold" htmlFor="catalog-sort">Ordenar por</label>
            <select id="catalog-sort" className="form-select" value={sort} onChange={(event) => updateParam('orden', event.target.value === 'name' ? '' : event.target.value)}>
              <option value="name">Nombre (A-Z)</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option><option value="stock-desc">Más existencias</option>
            </select>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mt-3">
          <label className="form-check d-flex align-items-center gap-2 mb-0" htmlFor="only-available">
            <input className="form-check-input mt-0" id="only-available" type="checkbox" checked={availableOnly} onChange={(event) => updateParam('disponibles', event.target.checked ? 'si' : '')} />
            <span className="form-check-label">Solo productos disponibles</span>
          </label>
          <button className="btn btn-link" type="button" onClick={resetFilters}>Limpiar filtros</button>
        </div>
      </form>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <h2 className="h5 mb-0">Resultados <span className="text-secondary fw-normal">({visible.length})</span></h2>
        <span className="small text-secondary">Origen: Excel académico Forma B · CLP</span>
      </div>
      {visible.length ? <div className="row g-4">{visible.map((product) => <div className="col-12 col-sm-6 col-xl-4" key={product.id}><ProductCard product={product} /></div>)}</div> : (
        <div className="empty-state surface-panel" role="status"><div className="empty-icon" aria-hidden="true">🔎</div><h2 className="h4">No encontramos productos</h2><p className="text-secondary">Prueba otra búsqueda o limpia los filtros.</p><button className="btn btn-dark" onClick={resetFilters} type="button">Mostrar catálogo completo</button></div>
      )}
    </section>
  );
}
