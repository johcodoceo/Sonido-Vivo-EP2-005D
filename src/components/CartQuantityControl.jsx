import { useEffect, useState } from 'react';

/** Permite decrementar/incrementar y escribir cantidad con validación visible. */
export default function CartQuantityControl({ productId, productName, quantity, stock, onChange }) {
  const [draft, setDraft] = useState(String(quantity));
  const [error, setError] = useState('');

  useEffect(() => { setDraft(String(quantity)); setError(''); }, [quantity]);

  function apply(value) {
    const message = onChange(productId, value);
    setError(message || '');
    if (!message) setDraft(String(value));
  }

  function submit(event) {
    event.preventDefault();
    const trimmed = draft.trim();
    const parsed = Number(trimmed);
    if (!trimmed || !Number.isSafeInteger(parsed) || parsed < 1) {
      setError('Ingresa una cantidad entera desde 1.');
      return;
    }
    apply(parsed);
  }

  return <div>
    <form onSubmit={submit} noValidate className="d-flex align-items-center gap-2 flex-wrap">
      <button type="button" className="btn btn-outline-secondary btn-sm cart-adjust-btn"
        disabled={quantity <= 1} aria-label={`Disminuir cantidad de ${productName}`}
        onClick={() => apply(quantity - 1)}>−</button>
      <label className="visually-hidden" htmlFor={`quantity-${productId}`}>Cantidad de {productName}</label>
      <input id={`quantity-${productId}`} className={`form-control form-control-sm cart-qty-input ${error ? 'is-invalid' : ''}`}
        type="number" step="1" min="1" max={stock} value={draft}
        onChange={(event) => { setDraft(event.target.value); setError(''); }} />
      <button type="button" className="btn btn-outline-secondary btn-sm cart-adjust-btn"
        disabled={quantity >= stock} aria-label={`Aumentar cantidad de ${productName}`}
        onClick={() => apply(quantity + 1)}>+</button>
      <button className="btn btn-sm btn-outline-dark" type="submit">Actualizar</button>
    </form>
    {error && <p className="text-danger small mt-2 mb-0" role="alert">{error}</p>}
  </div>;
}
