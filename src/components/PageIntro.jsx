export default function PageIntro({ eyebrow, title, description, children }) {
  return (
    <div className="page-intro d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
      <div>
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="page-title mb-2">{title}</h1>
        {description && <p className="text-secondary mb-0 lead-sm">{description}</p>}
      </div>
      {children}
    </div>
  );
}
