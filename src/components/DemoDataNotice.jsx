export default function DemoDataNotice() {
  return (
    <div className="alert alert-info d-flex gap-2 align-items-start" role="note">
      <span aria-hidden="true">ⓘ</span>
      <div><strong>Catálogo académico Forma B.</strong> Se importaron las 51 fichas detalladas del Excel de Sonido Vivo, con sus códigos, marcas, modelos, precios y stock. El archivo describe 340 referencias en total, pero solo entrega estas 51 fichas. Los datos pueden modificarse localmente; no son inventario sincronizado ni ventas reales.</div>
    </div>
  );
}
