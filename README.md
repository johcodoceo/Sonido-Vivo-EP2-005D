# Sonido Vivo · Forma B · Evaluación Parcial 2 · Etapa 3 (Carrito)

Continuación de la **Etapa 2 con el catálogo real del Excel Forma B**. Se mantienen React + Vite, React Router, Bootstrap 5, componentes reutilizables, CRUD de productos y ajuste de inventario. Esta nueva etapa incorpora **carrito funcional de frontend**, sin cobros ni pedidos reales.

## Datos originales

- **51 productos individuales** y **10 categorías** importados de `docs/DSY1104_Forma_B_Catalogo_Sonido_Vivo.xlsx`.
- La descripción del negocio señala 340 referencias, pero el Excel entregado solamente individualiza 51; **no se inventaron las restantes**.
- Se respetaron códigos, nombres, marcas, modelos, precios CLP, stock y descripciones de esas 51 fichas.
- Se mantiene el CRUD de Administrador y actualización de inventario de Vendedor desde la etapa anterior.

## Instalar y ejecutar

Se recomienda Node 20.19+ o Node 22.12+ (o una versión compatible con Vite 6).

```bash
npm install
npm run dev
```

Abrir la dirección indicada por Vite (usualmente `http://localhost:5173/`).

## Cómo probar la Etapa 3

1. En la pantalla `/ingresar`, entra como **Cliente** (modo demostración).
2. Abre **Catálogo**: selecciona un producto disponible, pulsa **Agregar al carrito**, o abre su detalle y elige varias unidades.
3. En **Carrito** comprueba los productos, la suma de unidades, el subtotal individual y el total estimado en pesos chilenos.
4. **Aumenta, disminuye o escribe** una cantidad; intenta superar el stock y observa el mensaje de validación. También puedes quitar una línea o vaciar todo el carrito confirmando la acción.
5. Recarga la página o cierra la sesión y vuelve a entrar como Cliente: el carrito se recupera desde `localStorage`.
6. Ingresa como **Vendedor** → Inventario, busca el mismo producto y reduce su stock. Vuelve a ingresar como Cliente: si la cantidad guardada lo superaba, el carrito se ajusta al stock disponible. Si el stock queda en cero se retira esa línea.
7. Ingresa como **Administrador**: podrá probar el carrito (separado del de Cliente) y gestionar productos. Eliminar un producto que estaba en un carrito hará que desaparezca de ese carrito al volver a abrirlo.

### Comandos de revisión

```bash
npm run check:catalog    # 51 productos/CRUD/datos, sin dependencias
npm run check:cart       # 51 productos/carrito/stock/persistencia, sin dependencias
npm test                 # Vitest + React Testing Library
npm run test:coverage
npm run build
```

`check:cart` y `check:catalog` requieren solo Node. Los demás requieren `npm install`.

## Estructura nueva

- `src/services/cartRepository.js`: funciones **puras** para validar cantidades, agregar, modificar, eliminar, reconciliar inventario y calcular subtotales.
- `src/context/CartContext.jsx`: estado compartido mediante Context, persistencia y separación por usuario simulado.
- `src/pages/CartPage.jsx`: interfaz del carrito, totales y acciones.
- `src/components/CartQuantityControl.jsx`: control de cantidad con botones, campo numérico y mensajes de validación.
- `src/components/ProductCard.jsx` y `src/pages/ProductDetailPage.jsx`: nuevos botones de agregar al carrito.
- `src/components/SiteHeader.jsx`: contador visible en el menú Carrito.
- `src/test/cartRepository.test.js`, `src/test/CartPage.test.jsx`, `src/test/CartQuantityControl.test.jsx`: pruebas adicionales de lógica, interacciones y DOM.

## Guardado local y roles

- El catálogo se guarda como antes bajo `sonido-vivo-catalogo-forma-b-v3`. **No se borra el catálogo que hayas editado** en esta misma versión.
- El carrito guarda solo `{productId, quantity}` bajo `sonido-vivo-carrito-forma-b-v1:demo-cliente` (y otra clave para `demo-administrador`). Los importes salen del precio **actual** del catálogo, no de un precio antiguo guardado en el carrito.
- `localStorage` persiste entre recargas en el mismo navegador y mismo origen; no sincroniza otros computadores ni pestañas automáticamente.
- El **Vendedor** ve el catálogo y gestiona inventario, pero no tiene permiso de comprar en la interfaz. **Cliente** y **Administrador** sí pueden usar carrito de demostración.
- Si se reduce stock, se agota o se elimina un producto, las cantidades del carrito se ajustan o eliminan al usar la aplicación. **Agregar al carrito no descuenta ni reserva unidades**.
- El rol de acceso es **simulado** y se conserva únicamente en `sessionStorage`; no hay contraseñas reales, tokens, control de autorización de backend, API, base de datos, sistema de pedidos, pago ni cobro.
- La presentación de datos comerciales es académica y **no se afirma disponibilidad real sincronizada**.
- El precio final que aparece es un **total estimado de productos, sin despacho**. El botón de confirmación de pedido se mantiene deshabilitado hasta implementar la etapa de pedidos.

## Alcance EP2

La EP2 exige un frontend React estructurado, navegable y responsivo, operaciones sobre datos simulados y pruebas con Vitest/React Testing Library. Esta entrega **no sustituye** el trabajo pendiente de pedidos simulados, documentación ERS V2, cobertura, GitHub, video o defensa técnica. La arquitectura semestral final (Spring Boot, MySQL, seguridad real, REST, Docker/AWS, mapas) corresponde a desarrollos posteriores.

## Notas para la evaluación

Puedes explicar: `useState` en la cantidad, `useContext` para compartir carrito entre páginas, `props` en las tarjetas y los controles, `localStorage` para conservar selección, funciones puras en `cartRepository`, `React Router` para navegación, pruebas de stock, y por qué se debe validar el stock también **en un backend** cuando exista: esta etapa es una simulación solo en navegador.
