# Sonido Vivo · Forma B · Evaluación Parcial 2 · Catálogo corregido

Este proyecto **continúa la Etapa 2** de Sonido Vivo (React + Vite + React Router + Bootstrap + Vitest/React Testing Library), **ahora con el Excel real de la Forma B**. No es aún la Etapa 3 de carrito.

## Datos importados

- **51 productos concretos** importados del Excel de la forma B, hoja `Catálogo de Productos`.
- **10 categorías** de la hoja `Categorías`.
- **340 referencias aproximadas** declaradas por el negocio: el archivo no incluye las fichas de las otras 289.
- En cada producto se preservan código original, categoría, nombre, marca, modelo, stock, precio CLP y descripción.
- Fuente original copiada en `docs/DSY1104_Forma_B_Catalogo_Sonido_Vivo.xlsx`. Documentación en `docs/ORIGEN_CATALOGO.md`.
- Los símbolos de productos son ilustrativos, porque el catálogo no trae imágenes.

## Ejecutar

Recomendado Node.js 20.19+ o 22.12+. En VS Code, abrir esta carpeta y ejecutar:

```bash
npm install
npm run dev
```

## Pruebas y compilación

```bash
npm run check:catalog
npm test
npm run test:coverage
npm run build
```

## Qué probar

- Ingresar en `/ingresar` como **Cliente** → Inicio → Catálogo → ver 51 fichas, filtrar las 10 categorías, buscar por `F310`, `GA001` o `Yamaha`, ver detalle.
- Ingresar como **Administrador** → Administración → Gestión de productos: crear, editar, eliminar; el formulario incorpora ahora **modelo**.
- Ingresar como **Vendedor** → Inventario: modificar stock local de una ficha y volver a verla en catálogo.

## Persistencia, simulación y seguridad

El proyecto usa un estado React conectado a `localStorage` bajo `sonido-vivo-catalogo-forma-b-v3`; esta nueva clave **no reutiliza** los antiguos 18 productos ficticios de `sonido-vivo-productos-demo-v2`.

Si no aparecen los 51 productos iniciales por una modificación anterior de esta misma versión, desde herramientas del navegador → **Application / Local Storage**, elimina `sonido-vivo-catalogo-forma-b-v3` y recarga la página.

Los permisos en la interfaz son **simulados**: no existe aún autenticación segura, backend, transacciones de stock entre usuarios, pasarela de pago ni sincronización en tiempo real. Los precios/stock vienen del Excel académico, no de un servicio actualizado.

## Etapas siguientes

- **Etapa 3:** carrito con cantidades, subtotal, totales, persistencia y límites por stock.
- Etapas posteriores EP2: pedido simulado, pruebas/cobertura final y documentación ERS V2 y video.
- A futuro, requisitos semestrales: backend Spring Boot con API, base de datos, seguridad real, mapa, Docker/AWS.

`npm run check:catalog` se ejecuta incluso sin instalar dependencias (requiere Node.js), porque verifica únicamente las funciones de datos y sus invariantes.
