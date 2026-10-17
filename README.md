# Sonido Vivo · Forma B · Desarrollo Full Stack II · EP2 · Etapa 4

**Aplicación React + Vite + Bootstrap 5 con navegación React Router, catálogo real del Excel Forma B, administración de productos, inventario, carrito y pedidos de demostración.**

> IMPORTANTE: Esta aplicación es únicamente una **simulación académica del frontend**. No existe autenticación segura, procesamiento de pagos, envío de correo, confirmación con tienda física, backend ni base de datos. No ingreses datos personales reales en el formulario de confirmación: utiliza datos inventados.

## Datos oficiales preservados

- `docs/DSY1104_Forma_B_Catalogo_Sonido_Vivo.xlsx`: fuente académica original entregada por el estudiante.
- **51 fichas con datos concretos** y **10 categorías**; el caso describe **340 referencias totales**, pero el Excel individualiza solo 51. No se inventaron 289 productos.
- Identificadores, nombres, marcas, modelos, precios CLP y stocks iniciales correspondientes al Excel. Las modificaciones de catálogo, carrito y pedidos son locales al navegador.

## Instalación (VS Code)

Recomendado: Node.js 20.19+ o 22.12+; npm habilitado.

```bash
npm install
npm run dev
```

Abre el URL que muestra Vite (generalmente http://localhost:5173).

## Recorrido recomendado para la demostración

1. Accede como **Cliente** desde `/ingresar`.
2. Ve a **Catálogo**, elige una guitarra con existencias y agrégala al carrito.
3. En **Carrito** cambia la cantidad; verifica el subtotal, total y límite de stock.
4. Pulsa **Continuar a confirmar pedido**. Rellena **nombre y correo ficticios** y elige **Retiro en tienda** o **Despacho a domicilio**. Para despacho se validan ciudad y dirección ficticias.
5. Comprueba que los campos obligatorios muestran errores cuando faltan o son inválidos. Marca la casilla de reconocimiento de simulación y confirma.
6. Observa el código creado, el mensaje de confirmación y el detalle en **Mis pedidos**. El carrito se vacía y el stock local disminuye.
7. Cierra sesión e ingresa como **Vendedor**. Ve a **Gestión de pedidos**; encuentra el pedido, filtra y avanza de **En preparación → Despachado → Entregado** si elegiste despacho, o **En preparación → Listo para retiro → Entregado** si elegiste retiro.
8. Vuelve a entrar como Cliente y consulta el historial para ver el cambio de estado.
9. Ingresa como **Administrador**. Abre **Administración → Pedidos**, y también **Gestión de productos**. Podrás consultar pedidos y usar el CRUD existente.
10. Recarga la página para comprobar persistencia de pedido, carrito y stock en `localStorage`.

## Rutas principales

| URL | Rol | Función |
| --- | --- | --- |
| `/ingresar` | Público | Selección de perfil de demostración |
| `/catalogo` y `/catalogo/:productId` | Cualquier perfil autenticado (demo) | Productos, búsqueda y detalle |
| `/carrito` | Cliente/Administrador | Agregar, modificar, quitar y revisar carrito |
| `/confirmar-pedido` | Cliente/Administrador | Validar formulario y registrar pedido ficticio |
| `/mis-pedidos` | Cliente/Administrador | Historial de pedidos del perfil actual |
| `/vendedor` | Vendedor/Administrador | Acceso al inventario y pedidos |
| `/vendedor/inventario` | Vendedor/Administrador | Ajustar stock |
| `/vendedor/pedidos` | Vendedor/Administrador | Consultar y avanzar los estados |
| `/administracion` | Administrador | Panel general |
| `/administracion/productos` | Administrador | CRUD de productos |
| `/administracion/pedidos` | Administrador | Consultar y avanzar los estados |

## Archivos de la Etapa 4

- `src/services/orderRepository.js`: validaciones puras, captura de precios y productos al confirmar, controles de stock, persistencia local con intento de reversión en caso de error, transiciones de estado.
- `src/context/OrderContext.jsx`: comparte pedidos, historial por perfil y acciones para confirmar y avanzar estados.
- `src/pages/CheckoutPage.jsx`: formulario con retroalimentación visible, confirmación explícita y resumen.
- `src/pages/OrdersPage.jsx`: historial del Cliente con detalles y seguimiento.
- `src/pages/OrderManagementPage.jsx`: listado, filtros, búsqueda y actualización de estados de pedidos por Vendedor/Administrador.
- `src/components/OrderCard.jsx`: componente reutilizable para cliente y personal interno.
- `src/test/orderRepository.test.js`, `src/test/CheckoutPage.test.jsx`, `src/test/OrderCard.test.jsx`: pruebas de lógica, estados, formularios y UI.
- `scripts/checkOrders.mjs`: verificación sin dependencias adicionales para poder ejecutar algunas pruebas incluso sin instalar npm.

## Datos y persistencia

El proyecto utiliza `localStorage` con claves distintas:

- `sonido-vivo-catalogo-forma-b-v3`: catálogo y stock actuales de esta simulación. **Se conserva el almacenamiento de la Etapa 3**.
- `sonido-vivo-carrito-forma-b-v1:demo-cliente` (y `:demo-administrador`): selección por rol/usuario de prueba.
- `sonido-vivo-pedidos-forma-b-v1`: conjunto de pedidos locales; cada registro tiene `userId`, copia de datos del producto, monto al momento de compra, modalidad, contacto ficticio, fecha, estado e historial.

Un pedido descontará el stock **una sola vez durante su confirmación**; el cambio de estado posterior no modifica el stock. El precio histórico de un pedido no cambia cuando se edita el producto. Un pedido solo pasa por las etapas admitidas; Cliente no dispone de controles de avance. Las simulaciones de dos perfiles comparten el mismo navegador, pero el historial del Cliente se filtra por usuario de demo.

**Limitaciones:** no hay reservas multiusuario, concurrencia entre pestañas, aislamiento seguro de datos personales, transacciones en servidor ni sincronización entre computadores. La escritura local de los tres elementos (pedidos, productos y carrito) implementa una reversión de mejor esfuerzo, pero **no ofrece garantía de transacción ACID**. El caso completo requiere en etapas posteriores API REST Spring Boot, persistencia relacional y seguridad real.

El pedido **no tiene comprobante real de pago ni estado de pago verificado**, el monto representa solo productos y **no incluye una tarifa de despacho**, pues el caso no entrega una tarifa. El botón guarda solamente una solicitud ficticia.

### Volver a los datos iniciales para demostrar de nuevo

Desde las herramientas del navegador → Aplicación → Almacenamiento local, elimina únicamente las claves anteriores y recarga. Esto reinicia datos, carritos y pedidos de esta app en ese navegador y origen. Realiza esta operación solo si quieres descartar los cambios de demostración.

## Pruebas y compilación

```bash
npm run check:catalog
npm run check:cart
npm run check:orders
npm test
npm run test:coverage
npm run build
```

Los tres scripts `check:*` son ejecutables solo con Node. Vitest y Vite necesitan `npm install`. Las pruebas de pedidos abarcan validaciones de retiro y despacho, stock insuficiente, capturas históricas de precios, carrito obsoleto, almacenamiento con errores, estados permitidos y restricciones de UI.

En el entorno donde se generó esta entrega **no fue posible descargar dependencias de npm (`EAI_AGAIN`, registro inaccesible)**. Por ello, aunque se verificaron los scripts Node, la sintaxis de los módulos y las rutas de importación, **no se declara que la suite Vitest ni `npm run build` hayan terminado correctamente**. Deben ejecutarse en tu computador.

## Qué falta para el cierre de EP2

La presente **Etapa 4** no equivale a la entrega completa: sigue pendiente revisar requisitos restantes de formularios y administración de usuarios, ejecutar y documentar pruebas (al menos 10 significativas según la guía), preparar cobertura, ERS V2, README final, commits de los integrantes, video y entrega individual de artefactos. En la evaluación se debe explicar que roles, permisos, pedidos, stock y cuenta de usuario son simulaciones locales.
