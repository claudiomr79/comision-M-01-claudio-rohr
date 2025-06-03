# comision-M-01-claudio-rohr

Proyecto Integrador Final del Tramo III de Argentina Programa

## 🌟 Travel Platform - Plataforma Interactiva de Viajes

Una aplicación web moderna para compartir experiencias de viaje, construida con React, Node.js y Bootstrap.

### 🚀 Características

- **Frontend moderno**: React con Vite y Bootstrap 5
- **Backend robusto**: Node.js con Express
- **Diseño responsivo**: Totalmente adaptable a móviles
- **Gestión de posts**: Crear, ver, editar y eliminar posts de viajes
- **Sistema de comentarios**: Comentarios interactivos
- **Formularios de registro y login**: Interfaz completa de usuarios

### 🛠️ Tecnologías utilizadas

**Frontend:**

- React 18
- Vite
- Bootstrap 5
- Font Awesome
- CSS3 con animaciones

**Backend:**

- Node.js
- Express.js
- Express Validator
- CORS
- Helmet (seguridad)
- Morgan (logging)

### 📦 Instalación y ejecución

#### Método rápido (Windows):

1. Ejecuta `setup.bat` para instalar todas las dependencias
2. Ejecuta `start.bat` para iniciar ambos servidores

#### Método manual:

**Backend:**

```bash
cd Backend
npm install
npm run dev
```

**Frontend:**

```bash
cd "Frontend/Plataforma Interactiva de Viajes con Registro y Login"
npm install
npm run dev
```

### 🌐 URLs de acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3002/api
- **Endpoint API posts**: http://localhost:3002/api/posts

#### Métodos disponibles (Endpoints REST)

- `POST /api/users/register` — Registrar nuevo usuario
- `POST /api/users/login` — Iniciar sesión y obtener JWT
- `GET /api/users/profile` — Perfil del usuario (JWT protegido)
- `PUT /api/users/profile` — Actualizar perfil (JWT protegido)
- `GET /api/posts` — Obtener todos los posts
- `GET /api/posts/:postId` — Obtener post por ID
- `POST /api/posts` — Crear post (JWT protegido)
- `PUT /api/posts/:postId` — Actualizar post (solo autor o admin, JWT protegido)
- `DELETE /api/posts/:postId` — Eliminar post (solo autor o admin, JWT protegido)
- `GET /api/comments/post/:postId` — Obtener comentarios de un post
- `POST /api/comments/post/:postId` — Crear comentario (JWT protegido)

### 🛠️ Instalación y ejecución

**Instalar y poblar BD:**

```bash
cd Backend
npm install
npm run seed    # Pobla la BD con datos de ejemplo
npm run dev     # Inicia servidor en puerto 3002
```

**Iniciar Frontend:**

```bash
cd "Frontend/Plataforma Interactiva de Viajes con Registro y Login"
npm install
npm run dev     # Inicia Vite en puerto 5173
```

### 🎯 Funcionalidades implementadas

✅ **Posts de viajes**

- Visualización de posts con imágenes
- Creación de nuevos posts
- Gestión completa (CRUD)
- Diseño de tarjetas con Bootstrap

✅ **Comentarios**

- Sistema de comentarios desde API externa
- Diseño moderno con cards

✅ **Navegación**

- Navbar responsivo con Bootstrap
- Navegación entre secciones
- Iconos de Font Awesome

✅ **Formularios**

- Registro de usuarios
- Inicio de sesión
- Validaciones de frontend

✅ **Diseño**

- Totalmente responsivo
- Animaciones CSS
- Tema moderno con Bootstrap
- Footer informativo

### 🔧 Errores resueltos

1. ✅ Variables no utilizadas en `Comment.jsx`
2. ✅ Archivos de componentes vacíos
3. ✅ Problema de conversión de tipos en el backend (string a number)
4. ✅ Archivo `index.css` vacío
5. ✅ Integración completa de Bootstrap
6. ✅ Mejora de navegación y UX
7. ✅ Adición de iconos y estilos modernos

### 🎨 Capturas de pantalla

La aplicación incluye:

- Página principal con hero section
- Galería de posts de viajes
- Formularios estilizados para registro/login
- Creador de posts con preview de imagen
- Administrador de posts con funciones CRUD
- Sección de comentarios interactiva

### 👨‍💻 Autor

**Claudio Rohr**  
Proyecto Integrador Final - Argentina Programa 2025

### 📝 Notas adicionales

- El backend incluye validaciones con express-validator
- Los posts tienen datos de ejemplo para testing
- La aplicación maneja errores de conexión gracefully
- Diseño mobile-first con Bootstrap
- Código limpio y bien estructurado
