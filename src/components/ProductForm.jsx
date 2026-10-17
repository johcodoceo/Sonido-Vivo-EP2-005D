import { useState } from 'react';
import { categories } from '../data/categories.js';
import { validateProduct } from '../services/productRepository.js';

const empty = { name: '', brand: '', model: '', categorySlug: 'guitarras-acusticas', description: '', price: '', stock: '' };

export default function ProductForm({ product = null, products, onSave, onCancel }) {
  const [values, setValues] = useState(product ? { ...product } : { ...empty });
  const [errors, setErrors] = useState({});

  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, general: undefined }));
  }

  function submit(event) {
    event.preventDefault();
    const checked = validateProduct(values, products, product?.id ?? null);
    if (Object.keys(checked.errors).length) { setErrors(checked.errors); return; }
    const resultErrors = onSave(checked.data) ?? {};
    setErrors(resultErrors);
    if (!Object.keys(resultErrors).length && !product) setValues({ ...empty });
  }

  function inputField(name, title, type = 'text', other = {}) {
    return <div className="col-md-6" key={name}>
      <label htmlFor={`product-${name}`} className="form-label fw-semibold">{title} *</label>
      <input {...other} id={`product-${name}`} className={`form-control ${errors[name] ? 'is-invalid' : ''}`} type={type} name={name} value={values[name]} onChange={change} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} />
      {errors[name] && <div className="invalid-feedback" id={`${name}-error`}>{errors[name]}</div>}
    </div>;
  }

  return (
    <form noValidate onSubmit={submit} className="surface-panel p-4 my-4">
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div><h2 className="h5 fw-bold">{product ? `Editar producto ${product.id}` : 'Crear un producto'}</h2><p className="text-secondary small mb-0">Los cambios se guardan únicamente en este navegador.</p></div>
        <button className="btn btn-outline-secondary btn-sm" type="button" onClick={onCancel}>Cerrar</button>
      </div>
      {errors.general && <div className="alert alert-danger" role="alert">{errors.general}</div>}
      <div className="row g-3">
        {inputField('name', 'Nombre del producto', 'text', { maxLength: 110 })}
        {inputField('brand', 'Marca', 'text', { maxLength: 80 })}
        {inputField('model', 'Modelo', 'text', { maxLength: 80 })}
        <div className="col-md-6"><label htmlFor="product-categorySlug" className="form-label fw-semibold">Categoría *</label>
          <select id="product-categorySlug" name="categorySlug" className={`form-select ${errors.categorySlug ? 'is-invalid' : ''}`} value={values.categorySlug} onChange={change}>
            {categories.map(({ slug, name }) => <option key={slug} value={slug}>{name}</option>)}
          </select>{errors.categorySlug && <div className="invalid-feedback">{errors.categorySlug}</div>}
        </div>
        {inputField('price', 'Precio en CLP', 'number', { min: 1, step: 1 })}
        {inputField('stock', 'Existencias', 'number', { min: 0, step: 1 })}
        <div className="col-12"><label htmlFor="product-description" className="form-label fw-semibold">Descripción *</label>
          <textarea id="product-description" name="description" rows="3" maxLength={450} className={`form-control ${errors.description ? 'is-invalid' : ''}`} value={values.description} onChange={change} />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        </div>
        <div className="col-12"><button className="btn btn-warning fw-semibold" type="submit">{product ? 'Guardar cambios' : 'Crear producto'}</button></div>
      </div>
    </form>
  );
}
