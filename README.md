#  Plataforma de Viajes 🌍✈️

## 📝 Descripción General

La Plataforma de Viajes es una aplicación web full-stack diseñada como un espacio interactivo para que los usuarios compartan y descubran experiencias de viaje. Los usuarios pueden registrarse, iniciar sesión, crear publicaciones sobre sus viajes (incluyendo descripciones, imágenes y ubicaciones), ver publicaciones de otros, expresar su apreciación dando "Me gusta" 👍 a las publicaciones y participar en discusiones a través de comentarios 💬.

## ✨ Características Principales

*   🔑 **Autenticación de Usuarios**: Registro e inicio de sesión seguros de usuarios mediante autenticación basada en JWT.
*   👤 **Perfiles de Usuario**: Ver y actualizar la información del perfil de usuario.
*   ✍️ **Gestión de Publicaciones (CRUD)**:
    *   ➕ Crear nuevas publicaciones de viajes con títulos, descripciones, imágenes, ubicaciones y etiquetas.
    *   👀 Ver un feed de todas las publicaciones de viajes.
    *   ℹ️ Ver información detallada de una sola publicación.
    *   🔄 Actualizar publicaciones existentes (solo autores y administradores).
    *   🗑️ Eliminar publicaciones (solo autores y administradores).
*   💖 **Elementos Interactivos**:
    *   👍 Dar "Me gusta" y quitar "Me gusta" de las publicaciones.
    *   📊 Ver el número de "Me gusta" en las publicaciones.
*   💬 **Sistema de Comentarios (CRUD)**:
    *   ➕ Añadir comentarios a las publicaciones.
    *   👀 Ver comentarios asociados a una publicación.
    *   🔄 Actualizar comentarios propios (solo autores y administradores).
    *   🗑️ Eliminar comentarios propios (solo autores y administradores).
*   🛡️ **Control de Acceso Basado en Roles**: Distinción básica entre usuarios regulares y administradores.
*   📱 **Frontend Responsivo**: Interfaz de usuario diseñada para ser accesible en varios dispositivos.

## 🛠️ Tecnologías Utilizadas (Tech Stack)

### ⚙️ Backend

*   **Entorno de Ejecución/Framework**: Node.js, Express.js
*   **Base de Datos**: MongoDB con Mongoose
*   **Autenticación**: JSON Web Tokens (JWT) (`jsonwebtoken`), Hashing de Contraseñas (`bcryptjs`)
*   **Middleware**:
    *   `cors` (Cross-Origin Resource Sharing)
    *   `helmet` (Cabeceras de seguridad)
    *   `morgan` (Registro de solicitudes HTTP)
    *   `express-validator` (Validación de entradas)
*   **Variables de Entorno**: `dotenv`

### 🎨 Frontend

*   **Framework/Librería**: React (con Vite)
*   **Enrutamiento**: React Router DOM (`react-router-dom`)
*   **Estilos**: Bootstrap, CSS Personalizado
*   **Gestión de Estado**: React Context API (para Autenticación)

## 📁 Estructura del Proyecto

El proyecto está organizado en dos directorios principales:

*   `Backend/`: Aplicación del servidor (Node.js, Express.js).
*   `Frontend/Plataforma Interactiva de Viajes con Registro y Login/`: Aplicación del cliente (React).

## 📋 Prerrequisitos

*   Node.js (v14.x o posterior)
*   npm (Node Package Manager)
*   MongoDB (local o Atlas)

## 🚀 Configuración e Instalación

### ⚙️ Backend

1.  **Navegar al Directorio del Backend**:
    ```powershell
    cd c:\dev\comision-M-01-claudio-rohr\Backend
    ```
2.  **Instalar Dependencias**:
    ```powershell
    npm install
    ```
3.  **Configurar Variables de Entorno (`.env`)**:
    En `c:\dev\comision-M-01-claudio-rohr\Backend\.env`:
    ```properties
    MONGODB_URI=tu_cadena_de_conexion_mongodb
    JWT_SECRET=tu_clave_secreta_jwt
    PORT=3002
    CORS_ORIGIN=http://localhost:5173,http://localhost:5174
    ```
    *(Asegúrate de que los valores en tu archivo `.env` sean correctos).*
4.  **Poblar Base de Datos (Opcional)**:
    ```powershell
    npm run seed
    ```
5.  **Iniciar Servidor de Desarrollo**:
    ```powershell
    npm run dev
    ```
    Servidor disponible en `http://localhost:3002`.

### 🎨 Frontend

1.  **Navegar al Directorio del Frontend**:
    ```powershell
    cd "c:\dev\comision-M-01-claudio-rohr\Frontend\Plataforma Interactiva de Viajes con Registro y Login"
    ```
2.  **Instalar Dependencias**:
    ```powershell
    npm install
    ```
3.  **Iniciar Servidor de Desarrollo**:
    ```powershell
    npm run dev
    ```
    Frontend disponible en `http://localhost:5173`.

## 📜 Scripts Disponibles

### ⚙️ Backend (`Backend/package.json`)

*   `npm run dev`: Inicia el servidor backend con `nodemon`.
*   `npm run seed`: Puebla la base de datos.

### 🎨 Frontend (`Frontend/Plataforma Interactiva de Viajes con Registro y Login/package.json`)

*   `npm run dev`: Inicia el servidor de desarrollo de Vite.
*   `npm run build`: Compila para producción.
*   `npm run lint`: Analiza el código con ESLint.
*   `npm run preview`: Previsualiza la compilación de producción.

## 📡 Endpoints de la API (Backend)

URL base: `/api` (Ej: `http://localhost:3002/api/users/register`)

### 👤 Autenticación y Usuarios (`/users`)

*   **`POST /users/register`**
    *   📝 **Descripción**: Registra un nuevo usuario.
    *   📦 **Cuerpo (JSON)**: `{ "name", "email", "password" }`
    *   ✅ **Respuesta (201)**: `{ "success", "message", "token", "user" }`
    *   🛡️ **Protegido**: No

*   **`POST /users/login`**
    *   📝 **Descripción**: Inicia sesión.
    *   📦 **Cuerpo (JSON)**: `{ "email", "password" }`
    *   ✅ **Respuesta (200)**: `{ "success", "message", "token", "user" }`
    *   🛡️ **Protegido**: No

*   **`GET /users/profile`**
    *   📝 **Descripción**: Obtiene el perfil del usuario autenticado.
    *   ✅ **Respuesta (200)**: `{ "success", "user" }`
    *   🛡️ **Protegido**: Sí (Token Bearer)

*   **`PUT /users/profile`**
    *   📝 **Descripción**: Actualiza el perfil del usuario autenticado.
    *   📦 **Cuerpo (JSON, opcional)**: `{ "name", "email", "avatar" }`
    *   ✅ **Respuesta (200)**: `{ "success", "message", "user" }`
    *   🛡️ **Protegido**: Sí

### 🏞️ Publicaciones (`/posts`)

*   **`GET /posts`**
    *   📝 **Descripción**: Obtiene todas las publicaciones.
    *   ✅ **Respuesta (200)**: `{ "success", "count", "posts": [...] }`
    *   🛡️ **Protegido**: No (`optionalAuth`)

*   **`GET /posts/:postId`**
    *   📝 **Descripción**: Obtiene una publicación por ID.
    *   ✅ **Respuesta (200)**: (Objeto de publicación)
    *   🛡️ **Protegido**: No (`optionalAuth`)

*   **`POST /posts`**
    *   📝 **Descripción**: Crea una nueva publicación.
    *   📦 **Cuerpo (JSON)**: `{ "title", "desc", "image", "location" (opc), "tags" (opc) }`
    *   ✅ **Respuesta (201)**: (Objeto de publicación creada)
    *   🛡️ **Protegido**: Sí

*   **`PUT /posts/:postId`**
    *   📝 **Descripción**: Actualiza una publicación (solo autor/admin).
    *   📦 **Cuerpo (JSON, opcional)**: Mismos campos que `POST /posts`.
    *   ✅ **Respuesta (200)**: (Objeto de publicación actualizada)
    *   🛡️ **Protegido**: Sí

*   **`DELETE /posts/:postId`**
    *   📝 **Descripción**: Elimina una publicación (solo autor/admin).
    *   ✅ **Respuesta (200)**: `{ "success", "message" }`
    *   🛡️ **Protegido**: Sí

*   **`POST /posts/:postId/like`**
    *   📝 **Descripción**: Da/quita "Me gusta" a una publicación.
    *   ✅ **Respuesta (200)**: `{ "success", "message", "post": { ... } }`
    *   🛡️ **Protegido**: Sí

### 💬 Comentarios (`/comments`)

*   **`GET /comments/post/:postId`**
    *   📝 **Descripción**: Obtiene comentarios de una publicación.
    *   ✅ **Respuesta (200)**: `{ "success", "count", "comments": [...] }`
    *   🛡️ **Protegido**: No

*   **`POST /comments/post/:postId`**
    *   📝 **Descripción**: Añade un comentario a una publicación.
    *   📦 **Cuerpo (JSON)**: `{ "content" }`
    *   ✅ **Respuesta (201)**: (Objeto de comentario creado)
    *   🛡️ **Protegido**: Sí

*   **`PUT /comments/:commentId`**
    *   📝 **Descripción**: Actualiza un comentario (solo autor/admin).
    *   📦 **Cuerpo (JSON)**: `{ "content" }`
    *   ✅ **Respuesta (200)**: (Objeto de comentario actualizado)
    *   🛡️ **Protegido**: Sí

*   **`DELETE /comments/:commentId`**
    *   📝 **Descripción**: Elimina un comentario (solo autor/admin).
    *   ✅ **Respuesta (200)**: `{ "success", "message" }`
    *   🛡️ **Protegido**: Sí

## 💾 Modelos de Base de Datos (Esquemas de Mongoose)

### 👤 Usuario (`Backend/models/user-model.js`)

*   `name`: String (requerido, trim, máx 50)
*   `email`: String (requerido, único, minúsculas, match regex)
*   `password`: String (requerido, mín 6, no seleccionado por defecto) - *Hasheada*
*   `avatar`: String (default: placeholder)
*   `role`: String (enum: `user`, `admin`; default: `user`)
*   `createdAt`: Date (default: ahora)
*   **Métodos**: `comparePassword()`
*   **Middleware**: Hashea contraseña antes de guardar.

### 🏞️ Publicación (`Backend/models/post-model.js`)

*   `title`: String (requerido, trim, máx 100)
*   `desc`: String (requerido, trim, máx 500)
*   `image`: String (requerido, match URL regex)
*   `author`: ObjectId (ref: `User`, requerido)
*   `comments`: [ObjectId (ref: `Comment`)]
*   `likes`: [{ `user`: ObjectId (ref: `User`), `createdAt`: Date }]
*   `location`: String (trim, opcional)
*   `tags`: [String (opcional)]
*   `createdAt`: Date (default: ahora)
*   `updatedAt`: Date (default: ahora)
*   **Middleware**: Actualiza `updatedAt`; Puebla `author` y `comments`.

### 💬 Comentario (`Backend/models/comment-model.js`)

*   `content`: String (requerido, trim, máx 300)
*   `author`: ObjectId (ref: `User`, requerido)
*   `post`: ObjectId (ref: `Post`, requerido)
*   `createdAt`: Date (default: ahora)
*   `updatedAt`: Date (default: ahora)
*   **Middleware**: Actualiza `updatedAt`; Puebla `author`.

---

Este README debería proporcionar una buena descripción general y guía para tu proyecto.
