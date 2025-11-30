# Proyecto: "Hermanos Jota" E-commerce

Sitio de catálogo y venta de productos para la mueblería "Hermanos Jota".

**Integrantes:**
- Ivo Mariezcurrena
- Leonel Martínez
- Franco Liutkevier
- Mayra Limachi

---

## Enlaces a los sitios desplegados

- **Frontend (React):** [https://itba-120.vercel.app/login](https://itba-120.vercel.app/login)
- **Backend (API):** [https://itba.onrender.com/](https://itba.onrender.com/)

---

## ✨ Core Features

### Para Usuarios

- **Autenticación de Usuarios:** Registro e inicio de sesión con JWT para una experiencia segura.
- **Catálogo de Productos:** Visualización de productos con detalles, incluyendo imágenes, descripción, precio y más.
- **Carrito de Compras:** Funcionalidad para agregar productos a un carrito de compras persistente.
- **Proceso de Checkout:** Simulación de un proceso de compra para finalizar un pedido.
- **Historial de Pedidos:** Los usuarios registrados pueden ver su historial de compras.
- **Perfil de Usuario:** Visualización y gestión de la información del perfil.

### Para Administradores

- **Gestión de Productos:** Crear, actualizar y eliminar productos del catálogo.
- **Gestión de Pedidos:** Visualizar todos los pedidos realizados por los usuarios y actualizar su estado (ej. "enviado", "entregado").
- **Acceso Restringido:** Paneles y acciones de administración protegidos para que solo usuarios con rol de 'admin' puedan acceder.

---

## 🛠️ Arquitectura y Tecnologías

El proyecto sigue una arquitectura `cliente-servidor` desacoplada, ideal para escalar y mantener.

- **Frontend:**
  - **Framework:** React con Vite.
  - **Enrutamiento:** React Router.
  - **Gestión de estado:** React Context API para el estado de autenticación.
  - **Estilos:** CSS Modules y archivos CSS por componente.

- **Backend:**
  - **Framework:** Node.js con Express.
  - **Base de Datos:** MongoDB con Mongoose para modelado de datos.
  - **Autenticación:** JSON Web Tokens (JWT) con roles ('user' y 'admin').
  - **API:** Diseño RESTful para gestionar productos, pedidos y usuarios.

---

## 🚀 Getting Started

Sigue estos pasos para levantar el proyecto en tu entorno local.

### Requisitos

- Node.js >= 16
- npm >= 8
- MongoDB (local o en un servicio como MongoDB Atlas)

### 1. Configuración del Backend

```bash
# Navega a la carpeta del backend
cd backend

# Instala las dependencias
npm install
```

Crea un archivo `.env` en la raíz de `/backend` con las siguientes variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hermanosjota
JWT_SECRET=tu_super_secreto_para_jwt
```

**Para iniciar el servidor:**

```bash
# Inicia en modo desarrollo con recarga automática
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

### 2. Configuración del Frontend

```bash
# Desde la raíz, navega a la carpeta del cliente
cd client/mi-app

# Instala las dependencias
npm install
```

Crea un archivo `.env.local` en la raíz de `/client/mi-app` para apuntar al backend:

```env
VITE_API_URL=http://localhost:3000
```

**Para iniciar la aplicación cliente:**

```bash
# Inicia el servidor de desarrollo de Vite
npm run dev
```

La aplicación React estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

---
