# Sonido Vivo — DSY1104 · EP2 · Forma B · Etapa 1

Proyecto académico frontend con **React + Vite + JavaScript**, **React Router** y **Bootstrap 5**. Basado en el documento de contexto *Forma B — Tienda Sonido Vivo* y en las orientaciones EP2 2026-2.

## Requisitos del entorno

- Node.js **20.19+ o 22.12+** recomendado para Vite 6 (también existen versiones de Node 18 compatibles con Vite 6, pero se recomienda utilizar LTS actual).
- npm, conexión a internet para la **primera instalación** de paquetes.
- Visual Studio Code recomendado.

## Ejecución (Windows, PowerShell o terminal de VS Code)

```bash
npm install
npm run dev
```

Abrir la dirección que indique Vite, normalmente `http://localhost:5173/`.

```bash
npm run build
npm test
npm run test:watch
npm run test:coverage
```

> El ZIP **no incluye `node_modules`**. Se instala con `npm install`.

## Explorar las pantallas

1. Abrir la aplicación: la ruta raíz requiere una sesión de demostración y redirige a **/ingresar**.
2. Pulsar uno de los botones **Entrar como Cliente / Vendedor / Administrador**.
3. Revisar el menú superior y visitar: **Inicio**, **Catálogo**, **Ubicaciones**. Según rol, se agregan **Carrito**, **Mis pedidos**, **Vendedor** y **Administración**.
4. Revisar el filtro de categorías: cambia el parámetro `?categoria=` de la URL.
5. Pulsar **Salir**. La sesión temporal se elimina.
6. Para comprobar el control de navegación: ingresar como Vendedor e intentar `http://localhost:5173/administracion`. Redirige a `/sin-acceso`.

## Estructura

```text
src/
├── components/       # Reutilizables: Layout, Header, Footer, rutas, tarjetas
├── context/          # Estado de sesión simulada (Context API)
├── data/             # Categorías estáticas del contexto
├── pages/            # Una página React por vista
├── routes/           # Mapa de rutas React Router
├── styles/           # Bootstrap complementado con CSS propio
├── test/             # Configuración de Vitest + pruebas iniciales
├── utils/            # Constantes y funciones para roles
├── App.jsx
└── main.jsx
```

## Estado real del proyecto y alcance

### Implementado en Etapa 1

- Proyecto SPA estructurado en React + Vite + JavaScript.
- Navegación con React Router y Layout reutilizable.
- Diseño adaptable a pantalla pequeña y escritorio, con Bootstrap y CSS propio.
- Categorías iniciales basadas en la descripción del caso (sin productos ni precios).
- Sesiones **ficticias** de prueba seleccionando uno de los tres roles.
- Rutas y menús separados por rol, solo a nivel de interfaz.
- **6 pruebas iniciales**: roles, componente por props y navegación por guardas. Se deben ejecutar después de instalar dependencias.

### Pendiente para completar EP2

- Datos simulados de productos con CRUD y sincronización de interfaz.
- Ficha de producto, búsqueda y filtrado efectivos sobre productos.
- Carrito funcional, pedido / checkout simulado, vistas de resultado.
- Formularios funcionales y validaciones.
- Gestión simulada de productos, pedidos y usuarios.
- Completar **al menos 10 pruebas significativas** (actualmente hay 6 preparadas) y documento de cobertura con resultados reales.
- ERS versión 2, README final, GitHub, video y artefactos de entrega.
- Revisar adaptación a 360 px, 768 px, 1280 px en cada vista al avanzar.

### Para etapas posteriores del proyecto semestral

- Autenticación **real** y autorizaciones exigidas también por API.
- Backend Spring Boot, microservicios, base de datos normalizada, peticiones HTTP, despliegue AWS y Docker.
- Integración real de mapas y puntos de retiro; requiere dirección exacta, no incluida en el documento.
- Pagos y stock concurrente reales.

## Advertencias importantes

**La selección de roles de esta etapa NO es autenticación, NO utiliza tokens ni garantiza seguridad.** Se almacena un perfil de demostración en `sessionStorage` para ilustrar pantallas, y cualquier persona con el navegador puede elegir otro rol. No almacenar información personal o confidencial ni usar en producción. Las rutas restringidas del frontend tampoco protegen una API: el control de acceso seguro deberá residir en Spring Boot.

**Contradicción entre fuentes:** El Anexo 1 oficial menciona una tienda pública; sin embargo, el documento contextual Forma B establece que solo inicio de sesión y registro pueden ser accesibles sin autenticación. En esta base se respetó la regla específica de Forma B (catálogo tras acceso de prueba). Conviene confirmar con el docente si espera un escaparate público para EP2.

**Productos:** El caso menciona 340 productos y anticipa un Excel de catálogo, pero ese catálogo de Sonido Vivo **no se adjuntó**. No reutilizar el catálogo de la Forma C (Gas El Volcán).

## Próximo bloque

**Etapa 2:** Incorporar `src/data/products.js` con datos de ejemplo identificados como simulados; crear operaciones CRUD en utilidades/servicios, componentes `ProductCard` y `ProductDetail`, filtros y búsqueda, y conectar la UI con el estado React. Utilizar el catálogo real cuando esté disponible.
