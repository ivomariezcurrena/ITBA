
# ITBA-Sprint3y4

Proyecto: Sitio de catálogo de productos "Hermanos Jota"

Integrantes:
- Ivo Mariezcurrena
- Leonel Martínez
- Franco Liutkevier
- Mayra Limachi

---

## Enlaces a los sitios desplegados

- **Frontend (React):** [https://hermanosjota-gray.vercel.app/](https://hermanosjota-gray.vercel.app/)
- **Backend (API):** [https://itba.onrender.com/](https://itba.onrender.com/)

---

## Requisitos
- Node.js >= 16 (recomendado)
- npm >= 8

---

## Configuración de variables de entorno

### Backend (`backend/.env`)

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido de ejemplo:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hermanosjota
# Otras variables necesarias para tu entorno
```

Si vas a usar autenticación JWT, añade también:

```env
JWT_SECRET=una_clave_larga_y_segura_aqui
```

- `PORT`: Puerto donde corre el backend (por defecto 3000)
- `MONGO_URI`: Cadena de conexión a MongoDB local o remota

### Frontend (`client/mi-app/.env.local`)

Crea un archivo `.env.local` en `client/mi-app/` con el siguiente contenido de ejemplo:

```env
VITE_API_URL=http://localhost:3000
# Otras variables si tuvieras
```

- `VITE_API_URL`: URL base de la API backend (ajusta según despliegue)

---

## Estructura del repositorio (resumen)
- backend/ — API Express, sirve datos y imágenes
  - server.js
  - routes/
  - data/
  - img/
- client/mi-app — aplicación React (Vite)
  - src/ (App.jsx, componentes, estilos)
  - public/
- README.md (este archivo)

---

## Instalación y ejecución local

### 1) Backend

```bash
cd backend
cp .env.example .env # o crea .env según el ejemplo arriba
npm install
# iniciar en desarrollo (usa nodemon si está configurado) o con node
npm run dev   # si existe script dev
# o
node server.js
```
- El backend escucha por defecto en: http://localhost:3000
- Endpoints principales:
  - GET /api/productos
  - GET /img/<nombre-de-imagen>

### 2) Cliente (React / Vite)

```bash
cd client/mi-app
cp .env.local.example .env.local # o crea .env.local según el ejemplo arriba
npm install
npm run dev
```
- El cliente Vite por defecto corre en: http://localhost:5173 (o puerto que muestre la consola)
- Para producción: `npm run build` y servir la carpeta `dist` como corresponda.

Notas:
- Si `npm run dev` falla por permisos (binarios en node_modules/.bin sin +x), ejecutar:
  ```bash
  # desde client/mi-app
  find node_modules/.bin -type f -exec chmod +x {} \;
  ```
  o reinstalar dependencias:
  ```bash
  rm -rf node_modules
  npm install
  ```

---

## Comprobaciones rápidas si no carga datos (Failed to fetch)
- Asegurar que el backend está corriendo (`curl -i http://localhost:3000/api/productos`)
- Revisar CORS: el servidor ya usa `cors()` en `server.js`
- Verificar puertos y que el cliente pida la misma URL `http://localhost:3000`
- Revisar consola del navegador (DevTools → Network / Console) para mensajes concretos

Comandos útiles:
```bash
# comprobar procesos escuchando
ss -ltnp | grep -E "5173|3000"
# probar endpoint
curl -i http://localhost:3000/api/productos
```

---

## Arquitectura y decisiones principales

- Backend (Node.js + Express)
  - Rutas en `routes/` (ej. `GET /api/productos`, `GET /api/productos/:id`).
  - Datos estáticos en `backend/data/products.json`.
  - Imágenes servidas desde `/img` con `express.static`.
  - CORS habilitado con `cors()` para desarrollo.
  - Logging básico y manejador de errores centralizado en `server.js`.
  - Scripts: `npm run dev` (nodemon) y `npm start` (node).

- Cliente (React + Vite)
  - Estructura por componentes: `ProductList`, `Card`, `Detalle`, `ContactForm`, `Navbar`, `Footer`.
  - Navegación con React Router (`App.jsx`).
  - Peticiones a backend con `fetch` usando `VITE_API_URL`.
  - Construcción de URL de imágenes en componentes:
    - Si `producto.imagen` es relativo, se usa `http://localhost:3000/<ruta>` (ej. `img/...png`).
  - Gestión de UI/estado relevante:
    - `ProductList` usa `useMemo` para memorizar el filtrado por búsqueda (mejora rendimiento).
    - La vista detalle recibe `producto` por prop y permite `agregarAlCarrito`.
    - Carrito: contador simple en `App.jsx` (estado en memoria).
  - ContactForm:
    - Componente `ContactForm/ContactForm.jsx` con validación y feedback visual.
  - Estilos: CSS por componente (Card.css, detalle.css, Navbar.css, Footer.css). Navbar con `backdrop-filter` para efecto glass.

- UX, accesibilidad y diseño
  - Tarjetas con sombra, hover y diseño centrado.
  - Página de detalle con imagen grande y detalles en grid.
  - Footer responsivo y menú que se adapta en móvil.
 
---

## Funcionalidad de administración (Admin)

Se agregó una interfaz simple de administración para "Hermanos Jota" que permite crear y eliminar productos desde el frontend.

- Ruta UI: `/admin/crear-producto` (componente `Crear-Producto.jsx`) — formulario para agregar productos y listado con acciones de eliminación.
- Boton de eliminar en detalle del producto
- Endpoints del backend usados:
  - POST /api/productos — crear producto (acepta multipart/form-data con campo `imagen` para subir imagen y campos adicionales en el body)
  - DELETE /api/productos/:id — eliminar producto por id

Campos disponibles para crear un producto (ahora incluidos en el modelo):
- nombre (string, obligatorio)
- descripcion (string)
- precio (number, obligatorio)
- stock (number)
- imagen (archivo, opcional) — se guarda en `/img` y `imagenUrl` contiene la ruta relativa (ej: `/img/12345-foto.jpg`)
- medidas (string)
- materiales (string)
- acabado (string)
- caracteristicas (string)

Ejemplo de uso con curl (subir imagen con FormData):

```bash
curl -X POST "https://itba.onrender.com/api/productos" \
  -F "nombre=Mi Producto" \
  -F "descripcion=Descripción corta" \
  -F "precio=1999.99" \
  -F "stock=10" \
  -F "medidas=100 x 35 x 200 cm" \
  -F "materiales=Roble" \
  -F "imagen=@./foto.jpg"
```

Ejemplo para eliminar un producto:

```bash
curl -X DELETE "https://itba.onrender.com/api/productos/<PRODUCT_ID>"
```

Notas de seguridad y despliegue:
- Los endpoints de administración (`POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`) ahora están protegidos y requieren autenticación JWT.
- Para usar las operaciones admin desde el frontend o `curl`, incluye el header `Authorization: Bearer <TOKEN>` obtenido en el login.

Ejemplo curl para crear un producto como admin (suponiendo que `TOKEN` es válido):

```bash
curl -X POST "https://itba.onrender.com/api/productos" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "nombre=Mi Producto" \
  -F "descripcion=Descripción corta" \
  -F "precio=1999.99" \
  -F "stock=10" \
  -F "medidas=100 x 35 x 200 cm" \
  -F "materiales=Roble" \
  -F "imagen=@./foto.jpg"
```

Si quieres administrar quién es admin, puedes:
- Promover manualmente un usuario en la base de datos (cambiar `role` a `admin`).
- Implementar endpoints adicionales para gestión de roles (solo admin) — puedo ayudar a añadirlos si lo deseas.

- Asegúrate de que `VITE_API_URL` en tu frontend (Vercel) apunte a la URL pública del backend en Render (`https://itba.onrender.com`).

---
