# Sonido Vivo · Forma B · Desarrollo Full Stack II · EP2 · Etapa 5

**React + Vite + Bootstrap 5 + React Router.** Se conserva la tienda académica de las etapas anteriores y se añade **registro de Cliente, CRUD de perfiles, roles, activación/desactivación, formularios y validaciones**.

> **Solo demostración de frontend.** El selector de perfiles NO pide ni comprueba contraseñas y cualquier persona puede seleccionar cualquier perfil activo. Los datos, permisos, productos y pedidos se simulan en el navegador. **No introduzcas datos personales reales ni credenciales.** No hay sistema seguro de acceso, servidor, pagos, envíos ni base de datos.

## Origen de los datos

`docs/DSY1104_Forma_B_Catalogo_Sonido_Vivo.xlsx` contiene **51 fichas de productos**, pertenecientes a **10 categorías**, con códigos, nombres, modelos, marcas, precios y stocks iniciales. El caso señala 340 referencias en total, pero no se han inventado las otras 289.

## Instalación y ejecución

Con Node.js 20.19+ o 22.12+ y npm:

```bash
npm install
npm run dev
```

Entra en el enlace de Vite (normalmente `http://localhost:5173`). Abre **la carpeta de esta etapa** en VS Code, no una mezcla de etapas anteriores. No se incluye `node_modules`.

## Qué implementar y cómo probar la Etapa 5

1. **Acceso:** `/ingresar` permite entrar con los tres perfiles ficticios iniciales (Cliente, Vendedor, Administrador). No hay contraseña ni autenticación real.
2. **Registro público:** `/registro`. Completa nombre, correo único y teléfono opcional **ficticios**. El registro público crea obligatoriamente un perfil **Cliente**. Luego selecciona ese perfil en el acceso de demostración.
3. **Administración:** ingresa como Administrador → **Administración → Usuarios** (`/administracion/usuarios`). Prueba **crear, editar y desactivar/reactivar** una cuenta de prueba, y **asignar Cliente, Vendedor o Administrador**.
4. **Filtros:** en el mismo panel busca por nombre, correo o ID y filtra por rol y estado (Activo/Inactivo). La tabla se adapta a móviles mediante desplazamiento horizontal.
5. **Seguridad de interfaz:** el Vendedor no puede entrar al panel de usuarios; Cliente solo accede a sus rutas. Se protege la sesión de demostración desactivada, no puede desactivarse la propia cuenta activa y se conserva al menos un Administrador activo.
6. **Validaciones:** comprueba campos vacíos, correo mal formado, correo duplicado, teléfono inválido y cambio del rol propio. Se muestran mensajes cerca del campo y un resumen de los errores.
7. **Persistencia:** crea un perfil y recarga la página. Los cambios de usuarios quedan almacenados en `localStorage`. El usuario seleccionado se recuerda solo en `sessionStorage` hasta salir o cerrar la pestaña.
8. **Regresión:** como Cliente agrega un producto del Excel al carrito, confirma un pedido **ficticio**, ingresa como Vendedor y actualiza el estado; luego verifica que el Cliente ve su historial. También puedes usar como Cliente una cuenta nueva creada en el registro.

**Controles para conservar el funcionamiento:** el último Administrador activo no se puede desactivar ni perder su rol; el Administrador actual no puede desactivar su propia cuenta ni cambiarse el rol. Si otro administrador modifica el rol de una cuenta, su próxima navegación refleja el rol actualizado. Un perfil desactivado no puede seleccionarse para ingresar.

## Rutas por rol

| Ruta | Acceso de demostración |
| --- | --- |
| `/ingresar`, `/registro` | Público |
| `/inicio`, `/catalogo`, `/catalogo/:productId`, `/ubicaciones` | Cualquier perfil activo |
| `/carrito`, `/confirmar-pedido`, `/mis-pedidos` | Cliente y Administrador |
| `/vendedor`, `/vendedor/inventario`, `/vendedor/pedidos` | Vendedor y Administrador |
| `/administracion`, `/administracion/productos`, `/administracion/pedidos` | Administrador |
| `/administracion/usuarios` | Administrador |

## Organización del código de esta etapa

- `src/services/userRepository.js`: validaciones y funciones puras de **crear, actualizar, cambiar estado, validar, leer y guardar** usuarios.
- `src/context/UserContext.jsx`: compartición de la lista y persistencia entre pantallas.
- `src/context/AuthContext.jsx`: sesión temporal de demostración asociada al perfil activo; admite sesiones de las etapas anteriores.
- `src/components/UserForm.jsx`: formulario reutilizable en registro y administración.
- `src/pages/RegisterPage.jsx`: registro público restringido al rol Cliente.
- `src/pages/LoginPage.jsx`: selector de cuentas ficticias iniciales o nuevas.
- `src/pages/UserManagementPage.jsx`: tabla, filtros, alta, edición, activación y desactivación.
- `src/routes/AppRoutes.jsx`: protección de `/administracion/usuarios` para Administrador.
- `src/services/orderRepository.js`: permite registrar pedidos de nuevos perfiles Cliente (se recibe el rol validado por `OrderContext`).
- `src/test/userRepository.test.js`, `src/test/UserForm.test.jsx`, `src/test/UserManagementPage.test.jsx`: pruebas nuevas de lógica e interfaz.

Se mantienen los componentes y servicios de catálogo, carrito y pedidos de las etapas 1–4.

## Datos locales y reinicio de la demostración

Almacenamiento utilizado:

- `sonido-vivo-catalogo-forma-b-v3`: catálogo y stock.
- `sonido-vivo-carrito-forma-b-v1:<id>`: un carrito por perfil.
- `sonido-vivo-pedidos-forma-b-v1`: pedidos, filtrados por `userId` al mostrarlos al Cliente.
- `sonido-vivo-usuarios-forma-b-v1`: perfiles ficticios y roles. Se incluyen tres perfiles iniciales; no hay contraseñas.
- `sessionStorage → sonido-vivo-demo-session-v1`: selector de perfil vigente.

Para **reiniciar solo usuarios**, abre las herramientas del navegador → **Aplicación / Storage → Local Storage**, elimina `sonido-vivo-usuarios-forma-b-v1` y luego sale de la sesión o elimina `sessionStorage → sonido-vivo-demo-session-v1` antes de recargar. **Esto descarta cambios en perfiles de prueba**. No borres claves de productos ni pedidos si deseas conservar esas pruebas.

## Comprobaciones y testing

```bash
npm run check:catalog
npm run check:cart
npm run check:orders
npm run check:users
npm test
npm run test:coverage
npm run build
```

`check:*` requiere únicamente Node. Los archivos `src/test/*` emplean **Vitest y React Testing Library** y cubren lógica, componentes, formularios e interacciones. La guía de EP2 solicita al menos **10 pruebas significativas** y un documento de cobertura; se incluyen más pruebas escritas, pero la ejecución real de Vitest y los porcentajes de cobertura deben verificarse y documentarse desde tu equipo.

Al generar esta versión, el entorno no pudo instalar dependencias por `EAI_AGAIN` (registro npm inaccesible). **No afirmamos haber ejecutado correctamente Vitest ni `npm run build`**. Sí se ejecutaron las comprobaciones con Node, y se analizaron los archivos JS/JSX y sus importaciones.

## Pendientes para cerrar EP2 y proyecto semestral

Para EP2: verificar compilación y pruebas reales, solucionar cualquier error, conseguir capturas de cobertura, finalizar ERS V2, documento de testing, GitHub con commits, video y entrega individual. Para fases futuras del proyecto semestral: autenticación con contraseñas seguras, backend de microservicios Spring Boot, API REST, control de permisos en servidor, base de datos relacional, mapa de ubicación verificada, Docker y AWS. **La protección visual de React no sustituye la autorización en backend.**
