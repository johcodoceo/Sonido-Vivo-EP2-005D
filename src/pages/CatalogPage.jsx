import { useSearchParams } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import { categories } from '../data/categories.js';

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const selected = params.get('categoria') ?? '';
  const category = categories.find((item) => item.slug === selected);

  function handleCategory(event) {
    const value = event.target.value;
    setParams(value ? { categoria: value } : {});
  }

  return (
    <section className="container section-space">
      <PageIntro eyebrow="CATÁLOGO · ESTRUCTURA INICIAL" title="Nuestros instrumentos" description="La navegación y el filtro por categoría están preparados. El archivo de productos y las operaciones CRUD se incorporarán en la siguiente etapa." />
      <div className="surface-panel p-4 p-md-5">
        <label className="form-label fw-semibold" htmlFor="catalog-category">Filtrar por categoría</label>
        <select id="catalog-category" className="form-select category-select" value={category?.slug ?? ''} onChange={handleCategory}>
          <option value="">Todas las categorías</option>
          {categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}
        </select>
        <div className="empty-state mt-4" role="status">
          <div className="empty-icon" aria-hidden="true">🎼</div>
          <h2 className="h4 fw-bold">{category ? `Categoría: ${category.name}` : 'Catálogo en preparación'}</h2>
          <p className="text-secondary mb-0">En la Etapa 2 incorporaremos los productos, precios, stock, búsqueda y detalle. No se muestran precios ni existencias ficticias.</p>
        </div>
      </div>
    </section>
  );
}
