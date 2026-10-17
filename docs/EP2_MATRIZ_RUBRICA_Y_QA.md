# Etapa 6 · Revisión de requisitos de EP2 · Sonido Vivo (Forma B)

**Estado:** revisión técnica PRELIMINAR al 14-10-2026. Una funcionalidad implementada o una prueba escrita NO se considera probada hasta ejecutar el proyecto y Vitest localmente.

## Relación entre rúbrica y código

| Criterio de EP2 | Evidencia preparada | Pendiente para certificar |
|---|---|---|
| React + Vite + JavaScript | `package.json`, `vite.config.js`, `src/main.jsx` | `npm install`, `npm run build` desde copia limpia |
| Separación por páginas y componentes | `src/pages/`, `src/components/`, `src/context/` | Abrir y explicar 2 componentes durante la defensa |
| Props, state y eventos | `ProductCard`, `UserForm`, `CartQuantityControl`, providers | Revisar interacciones en navegador |
| React Router y Layout | `src/routes/AppRoutes.jsx`, `AppLayout.jsx`, `ProtectedRoute.jsx` | Probar rutas con todos los roles |
| Bootstrap y responsive | `bootstrap` y `src/styles/main.css` | Verificar 360, 768 y 1280 px con capturas reales |
| Catálogo y CRUD simulado | 51 productos oficiales, `productRepository.js`, `ProductManagementPage.jsx` | Comprobar formularios en ejecución |
| Carrito y pedidos | `cartRepository.js`, `orderRepository.js`, contextos y vistas | Demostrar flujo de compra simulada en navegador |
| Roles y usuarios simulados | `userRepository.js`, `UserManagementPage.jsx`, `ProtectedRoute.jsx` | Demostrar bloqueos en navegador. NO es autorización segura |
| 10 pruebas unitarias significativas | 23 archivos `.test.*`, 111 declaraciones detectadas estáticamente | Confirmar total de pruebas aprobadas con `npm test` |
| Lógica, componentes, interacciones y spies | tests de repositorios, `ProductCard`, `CheckoutPage`, `OrderManagementPage`, `ProtectedRoute` | `npm test` y lectura de resultados reales |
| Cobertura de testing | `vite.config.js`: `v8`, texto, HTML y JSON Summary | `npm run test:coverage` y llenar porcentajes reales |
| Documento de cobertura | `docs/EP2_Informe_Cobertura_Preliminar.docx`, esta matriz | Rellenar sección, grupo, integrantes, enlace GitHub, métricas y resultados |
| ERS V2 | No incorporado a esta Etapa 6 | Crear/actualizar según requisitos y evolución real |
| GitHub / commits | Preparado para subir sin `node_modules` | Publicar repositorio, documentar aportes |
| Video y defensa | Guías oficiales disponibles | Grabar aplicación real 5–8 min y explicar pruebas |
| Entrega AVA | Instrucciones oficiales | Plazo: **lunes 19/10/2026, antes de las 13:00**. Entrega individual |

## Diferencias respecto del proyecto semestral completo

No se ha implementado una autenticación segura (el acceso es selección de perfil ficticio), backend Spring Boot, base de datos MySQL, microservicios, AWS, Docker ni pasarela de pagos. El mapa interactivo tampoco se ha implementado de forma verificada. El objetivo de EP2 aquí es demostrar frontend y pruebas; esas necesidades del caso semestral siguen abiertas.

## Guía para terminar la evidencia real

1. Descomprimir en una carpeta limpia y ejecutar `npm install`, `npm run dev`.
2. Probar manualmente roles, formulario de registro, búsquedas y carrito, registro de pedido y ajustes de inventario.
3. Ejecutar `npm run qa:static` y `npm run qa:node` para revisar dependencias internas y lógica base.
4. Ejecutar `npm test` (todos los tests deben aprobar) y `npm run test:coverage`.
5. Ejecutar `npm run report:coverage`: extrae métricas **solo del reporte real de Vitest** y crea `docs/EP2_COBERTURA_MEDIDA.md`.
6. Copiar los cuatro porcentajes, el estado real de las diez pruebas identificadas y capturas de la terminal al documento preliminar para dejarlo definitivo.
7. Ejecutar `npm run build`. Si algo falla, corregir ANTES de subir GitHub y grabar video.
8. Actualizar ERS V2 y revisar enlaces GitHub/Drive en ventana incógnita. Descargar ZIP final desde GitHub, no de una carpeta distinta.

## Verificaciones efectivamente realizadas en la generación de la Etapa 6

- Cuatro scripts Node de catálogo, carrito, pedidos y usuarios: aprobados (`QA_NODE_RESULTADOS.json`).
- Validación de sintaxis `.js` y `.mjs` e importaciones relativas: sin errores (`QA_ESTATICO_RESULTADOS.json`).
- Encontrados 23 archivos de pruebas y 111 declaraciones `it`/`it.each` en revisión de archivos; la cifra **no acredita 111 tests pasando** ni cuenta la expansión de casos parametrizados.
- Vitest, cobertura porcentual, compilación Vite y revisión visual responsiva: **NO ejecutados/verificados** en este entorno porque `npm install` falló por `EAI_AGAIN` al acceder a `registry.npmjs.org`.
