# Sonido Vivo · Forma B · Desarrollo Full Stack II · EP2 · Etapa 6

**Proyecto acumulativo de las etapas 1 a 5**, ahora con la Etapa 6: revisión, ampliación de pruebas unitarias y herramientas para generar evidencia de cobertura **real**.

> **Demostración de frontend.** El selector de perfiles no comprueba contraseñas y los datos locales no están protegidos como en un backend. No ingreses información personal real. Las compras, pagos y envíos son simulados.

## Instalación desde una carpeta nueva

Requiere Node.js 20.19+ o 22.12+ y npm con conexión a internet:

```bash
npm install
npm run dev
```

Una vez instalada la dependencia, abre el enlace indicado por Vite (habitualmente `http://localhost:5173`). No se incluye `node_modules`.

## Pruebas y calidad EP2

```bash
npm run qa:static           # revisión de imports y JS sin dependencias externas
npm run qa:node             # 4 verificaciones de lógica con Node, sin dependencias
npm test                    # suite Vitest + React Testing Library
npm run test:watch          # modo interactivo
npm run test:coverage       # cobertura V8: terminal, HTML y JSON
npm run report:coverage     # SOLO después de medir cobertura real
npm run build               # compilación producción Vite
```

**Resultado disponible al construir esta versión:** `qa:static` sin hallazgos; `qa:node` 4/4 aprobados. **No fue posible ejecutar Vitest ni Vite** porque `npm install` devolvió `EAI_AGAIN registry.npmjs.org`; por eso no hay porcentajes de cobertura verificados. `report:coverage` falla de forma intencional si no existe `coverage/coverage-summary.json`; no fabrica porcentajes. El reporte HTML se genera en `coverage/index.html` y esa carpeta no se entrega dentro del ZIP de origen.

## Nuevos elementos de Etapa 6

- `src/test/setup.js`: limpieza explícita de React Testing Library entre pruebas y reinicio de mocks.
- `src/test/LoginPage.test.jsx`: accesos por rol, desactivación y error de selección.
- `src/test/RegisterPage.test.jsx`: validación, registro Cliente y mensaje de almacenamiento.
- `src/test/OrdersPage.test.jsx`: historial vacío, confirmación y detalle para Cliente.
- `src/test/OrderManagementPage.test.jsx`: filtros, búsquedas y cambios de estado con spy.
- `vite.config.js`: reporter de cobertura JSON resumen además de text/HTML.
- `scripts/verifyProject.mjs`: revisión estática sin paquetes externos.
- `scripts/runNodeChecks.mjs`: ejecuta comprobaciones de datos, carrito, pedidos y usuarios.
- `scripts/writeCoverageReport.mjs`: crea reporte Markdown a partir de métricas genuinas de cobertura.
- `docs/EP2_MATRIZ_RUBRICA_Y_QA.md`: checklist con evidencias y pendientes reales.
- `docs/EP2_Informe_Cobertura_Preliminar.docx`: documento según la estructura solicitada por el docente, para terminar cuando Vitest se ejecute con éxito.

La suite incluye pruebas de **lógica/validaciones, componentes, interacciones y mocks/spies**. La revisión estática detectó 111 declaraciones de prueba en 23 archivos de test; no significa que las 111 se hayan ejecutado o aprobado.

## Datos y funciones mantenidas de etapas anteriores

- Catálogo importado desde Excel Forma B: **51 fichas oficiales** en 10 categorías. La fuente menciona 340 referencias totales, sin detallar las otras 289.
- Catálogo, búsqueda y filtros por marca/modelo/código, vista de detalle y CRUD simulado de productos.
- Carrito por usuario con control de stock, subtotal/total CLP y `localStorage`.
- Pedido ficticio con retiro/despacho, descuento de stock local, historial y estados de seguimiento.
- Gestión de usuarios Cliente/Vendedor/Administrador, registro ficticio, roles y desactivación; rutas visuales diferenciadas.
- Bootstrap 5, React Router y arquitectura por `pages`, `components`, `services` y `context`.

## Pendientes para la entrega real

1. **Instalar y ejecutar**: `npm test`, `npm run test:coverage`, `npm run report:coverage`, `npm run build`; corregir cualquier falla real.
2. Completar la identificación del grupo y porcentajes reales del documento de cobertura; añadir capturas de salida y análisis.
3. Verificar visualmente móviles (360 px), tabletas (768 px) y escritorio (1280 px).
4. Finalizar **ERS versión 2**, README/grupo, GitHub público con aportes y video narrado de 5–8 minutos.
5. Descargar el **ZIP definitivo desde GitHub** y subir en AVA individualmente antes del **19/10/2026 13:00**.

Los requisitos semestrales futuros de Spring Boot, API REST, control de acceso en servidor, MySQL, mapa interactivo verificado, Docker y AWS **no están implementados** por este frontend académico.
