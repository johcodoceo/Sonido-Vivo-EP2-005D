import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import PageIntro from '../components/PageIntro.jsx';
import ProductForm from '../components/ProductForm.jsx';
import DemoDataNotice from '../components/DemoDataNotice.jsx';
import { filterProducts, formatCLP } from '../services/productRepository.js';

export default function ProductManagementPage() {
  const { products, storageError, addProduct, editProduct, removeProduct } = useProducts();
  const [editingId, setEditingId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const editing = products.find((item) => item.id === editingId) ?? null;
  const deleting = products.find((item) => item.id === deletingId) ?? null;
  const visible = filterProducts(products, { query });

  function openCreate() { setEditingId(null); setFormVisible(true); setDeletingId(null); setNotice(''); }
  function openEdit(id) { setEditingId(id); setFormVisible(true); setDeletingId(null); setNotice(''); }
  function save(data) {
    const errors = editing ? editProduct(editing.id, data) : addProduct(data);
    if (!Object.keys(errors).length) { setFormVisible(false); setEditingId(null); setNotice(editing ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'); }
    return errors;
  }
  function confirmDelete() {
    if (!deleting) return;
    removeProduct(deleting.id);
    setDeletingId(null);
    if (editingId === deleting.id) { setEditingId(null); setFormVisible(false); }
    setNotice('Producto eliminado del catálogo local.');
  }

  return <section className="container section-space">
    <Link className="text-link d-inline-block mb-3" to="/administracion">← Volver al panel</Link>
    <PageIntro eyebrow="ADMINISTRADOR · PRODUCTOS" title="Gestión del catálogo" description="Operaciones CRUD sobre las 51 fichas importadas del catálogo académico Forma B y los productos que agregues." />
    <DemoDataNotice />
    {storageError && <div className="alert alert-danger" role="alert">{storageError}</div>}
    {notice && <div className="alert alert-success" role="status">{notice}</div>}
    <div className="surface-panel p-3 p-md-4">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div><h2 className="h5 fw-bold mb-1">Productos registrados: {products.length}</h2><p className="text-secondary small mb-0">Modifica los datos sin editar código fuente.</p></div>
        <button type="button" className="btn btn-warning fw-semibold" onClick={openCreate}>+ Nuevo producto</button>
      </div>
      <label htmlFor="admin-product-search" className="form-label fw-semibold">Buscar en el inventario</label>
      <input id="admin-product-search" className="form-control" placeholder="Buscar nombre, marca o código" value={query} onChange={(event) => setQuery(event.target.value)} />
    </div>
    {formVisible && <ProductForm key={editingId ?? 'nuevo'} product={editing} products={products} onSave={save} onCancel={() => { setFormVisible(false); setEditingId(null); }} />}
    {deleting && <div className="alert alert-danger mt-4" role="alert"><strong>¿Eliminar “{deleting.name}”?</strong><p className="mb-2">Esta acción lo quitará del catálogo en este navegador.</p>
      <div className="d-flex flex-wrap gap-2"><button type="button" className="btn btn-danger" onClick={confirmDelete}>Sí, eliminar</button><button type="button" className="btn btn-outline-secondary" onClick={() => setDeletingId(null)}>Cancelar</button></div>
    </div>}
    <div className="surface-panel mt-4 overflow-hidden">
      <div className="table-responsive"><table className="table table-hover align-middle mb-0">
        <caption className="visually-hidden">Tabla de productos en el catálogo de prueba</caption>
        <thead className="table-light"><tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Modelo</th><th scope="col">Precio (CLP)</th><th scope="col">Stock</th><th scope="col">Acciones</th></tr></thead>
        <tbody>{visible.map((item) => <tr key={item.id}>
          <th scope="row" className="small">{item.id}</th><td><strong>{item.name}</strong><small className="text-secondary d-block">{item.brand}</small></td><td>{item.model}</td><td>{formatCLP(item.price)}</td><td><span className={item.stock > 0 ? 'text-success' : 'text-danger'}>{item.stock}</span></td>
          <td><div className="d-flex flex-wrap gap-2"><button className="btn btn-sm btn-outline-dark" type="button" onClick={() => openEdit(item.id)} aria-label={`Editar ${item.name}`}>Editar</button><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => { setDeletingId(item.id); setNotice(''); }} aria-label={`Eliminar ${item.name}`}>Eliminar</button></div></td>
        </tr>)}</tbody>
      </table></div>
      {!visible.length && <div className="p-4 text-center text-secondary">No se encontraron productos.</div>}
    </div>
  </section>;
}
