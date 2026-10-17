import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import PageIntro from '../components/PageIntro.jsx';
import DemoDataNotice from '../components/DemoDataNotice.jsx';
import { filterProducts } from '../services/productRepository.js';

function StockRow({ item, onSave }) {
  const [value, setValue] = useState(String(item.stock));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  function submit(event) {
    event.preventDefault();
    const raw = value.trim();
    const stock = Number(raw);
    const message = raw === '' || !Number.isSafeInteger(stock) || stock < 0 ? 'Stock inválido: utiliza un número entero desde cero.' : onSave(item.id, stock);
    setError(message || ''); setSaved(!message);
  }
  return <tr>
    <th scope="row" className="small">{item.id}</th><td>{item.name}<small className="text-secondary d-block">{item.brand} · {item.model}</small></td><td>{item.stock}</td>
    <td><form className="d-flex flex-wrap align-items-start gap-2" noValidate onSubmit={submit}>
      <div><label className="visually-hidden" htmlFor={`stock-${item.id}`}>Nuevo stock de {item.name}</label><input id={`stock-${item.id}`} className={`form-control form-control-sm stock-input ${error ? 'is-invalid' : ''}`} type="number" min="0" step="1" value={value} onChange={(event) => { setValue(event.target.value); setError(''); setSaved(false); }} />
        {error && <span className="text-danger small d-block" role="alert">{error}</span>}{saved && <span className="text-success small d-block" role="status">Stock actualizado</span>}</div>
      <button type="submit" className="btn btn-outline-dark btn-sm">Actualizar</button>
    </form></td>
  </tr>;
}

export default function InventoryPage() {
  const { products, storageError, setStock } = useProducts();
  const [query, setQuery] = useState('');
  const visible = filterProducts(products, { query });
  return <section className="container section-space">
    <Link className="text-link d-inline-block mb-3" to="/vendedor">← Volver al panel</Link>
    <PageIntro eyebrow="VENDEDOR · INVENTARIO" title="Consultar y ajustar stock" description="Los vendedores pueden modificar existencias, sin gestionar usuarios ni cambiar los precios." />
    <DemoDataNotice />
    {storageError && <div className="alert alert-danger" role="alert">{storageError}</div>}
    <div className="surface-panel p-3 p-md-4 mb-4"><label className="form-label fw-semibold" htmlFor="inventory-search">Buscar producto</label><input id="inventory-search" className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre, marca o código" /></div>
    <div className="surface-panel overflow-hidden"><div className="table-responsive"><table className="table align-middle mb-0"><thead className="table-light"><tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Actual</th><th scope="col">Nuevo stock</th></tr></thead>
      <tbody>{visible.map((item) => <StockRow key={item.id} item={item} onSave={setStock} />)}</tbody></table></div>
      {!visible.length && <p className="p-4 mb-0 text-secondary">No hay coincidencias para esta búsqueda.</p>}
    </div>
    <p className="small text-secondary mt-3">Estos cambios son locales al navegador. No existe todavía sincronización entre vendedores ni protección de inventario concurrente.</p>
  </section>;
}
