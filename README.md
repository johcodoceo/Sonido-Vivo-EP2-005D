# Sonido Vivo · Forma B · Evaluación Parcial 2 · Etapa 7

**Base de código:** Etapa 6, SIN modificaciones a la lógica React/JSX. En esta etapa se incorporó documentación de entrega.

**Importante:** demostración académica frontend. Los perfiles no utilizan autenticación real y los datos se guardan en `localStorage` del navegador. No introducir datos privados reales ni considerarlo un sistema apto para producción.

## Funcionalidad disponible

- 51 fichas detalladas del Excel oficial de Forma B, en 10 categorías (el caso refiere 340 referencias totales, pero faltan 289 fichas detalladas).
- Catálogo, búsqueda, filtros, detalle y CRUD de productos; inventario editable por Vendedor/Administrador.
- Carrito por perfil con cantidades, validación de stock, subtotal/total en CLP y persistencia local.
- Checkout simulado con despacho/retiro, descuento de stock local, historial de pedidos y avance de estados.
- Administración simulada de usuarios (Cliente/Vendedor/Administrador), registro y rutas por rol en frontend.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

## Validación y pruebas

```bash
npm run qa:static
npm run qa:node
npm test
npm run test:coverage
npm run report:coverage
npm run build
```

**Resultados informados mediante capturas del equipo:** Vitest 2.1.9, 23/23 archivos y 115/115 tests aprobados. V8: Statements 75,68 %, Branches 77,65 %, Functions 68,15 %, Lines 75,68 %. Si se modifica el código, repetir las mediciones.

## Documentos en `docs/`

- `Sonido_Vivo_EP2_ERS_Version_2.docx`: ERS actualizado a V2 (faltan datos de sección, grupo, URL GitHub y revisión del equipo frente a un eventual V1).
- `Sonido_Vivo_EP2_Cobertura_Testing_Resultados_Reales.docx`: evidencia de 115 tests y cobertura con capturas; completar identificación.
- `Sonido_Vivo_EP2_Guia_GitHub_Video_Defensa.docx`: pasos de entrega individual, guion narrado y preparación de defensa.
- `DSY1104_Forma_B_Catalogo_Sonido_Vivo.xlsx`: catálogo original de referencia académica.

## Estado de entrega y limitaciones

- Pendiente: verificar responsive de todas las vistas a 360/768/1280 px y clon limpio en el equipo del estudiante.
- Pendiente: enlaces reales a GitHub y Google Drive, commits personales verificables, grabación y subida AVA.
- No incluidos en EP2: Spring Boot, APIs reales, autenticación/token, DB relacional, pasarela de pagos, mapas reales, AWS y Docker. La pantalla de ubicaciones es un marcador de posición.
- El **ZIP oficial que exige AVA debe descargarse del repositorio GitHub (Code → Download ZIP)** después de publicar esta versión. Este ZIP local es sólo el paquete de trabajo previo a la publicación.
- Fecha límite de entrega individual: **lunes 19 de octubre de 2026, antes de las 13:00**.
