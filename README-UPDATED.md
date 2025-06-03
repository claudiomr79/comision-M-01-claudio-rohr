# Travel Platform - Plataforma Interactiva de Viajes 🌍✈️

Una plataforma completa para compartir experiencias de viajes con sistema de autenticación, gestión de posts y comentarios, todo integrado con MongoDB.

## 🚀 Características

- **Autenticación JWT**: Registro, login y gestión de sesiones
- **CRUD Posts**: Crear, leer, actualizar y eliminar posts de viajes
- **Sistema de Comentarios Integrado**:
  - Comentarios asociados a posts específicos
  - Solo usuarios autenticados pueden comentar
  - Los usuarios pueden eliminar sus propios comentarios
  - Visualización de autor y fecha del comentario
  - Límite de 300 caracteres por comentario
- **Sistema de Likes**: Like/unlike en posts con estado visual
- **Base de Datos MongoDB**: Almacenamiento persistente con Mongoose
- **UI Responsive**: Interfaz moderna con Bootstrap 5 y Font Awesome
- **API RESTful**: Backend con Express.js y validaciones
- **Gestión de Estados**: Context API para autenticación global

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **express-validator** para validaciones
- **CORS**, **Helmet**, **Morgan** para seguridad y logging

### Frontend

- **React** + **Vite**
- **Bootstrap 5** para UI
- **Font Awesome** para iconos
- **Context API** para gestión de estado
- **Fetch API** para comunicación con backend

## 📋 Prerrequisitos

1. **Node.js** (v16 o superior)
2. **MongoDB** (local o MongoDB Compass)
3. **npm** o **yarn**

## 🔧 Instalación y Configuración

### Opción 1: Instalación Automática (Recomendado)

1. **Ejecutar el script de setup:**

   ```bash
   setup-new.bat
   ```

   Este script:

   - Instala dependencias del backend y frontend
   - Verifica la conexión a MongoDB
   - Puebla la base de datos con datos de prueba
   - Muestra instrucciones para el siguiente paso

2. **Iniciar la aplicación:**
   ```bash
   start.bat
   ```

### Opción 2: Instalación Manual

1. **Instalar dependencias del Backend**

   ```bash
   cd Backend
   npm install
   ```

2. **Instalar dependencias del Frontend**

   ```bash
   cd "Frontend/Plataforma Interactiva de Viajes con Registro y Login"
   npm install
   ```

3. **Configurar MongoDB**

   - Asegúrate de que MongoDB esté ejecutándose
   - La aplicación se conectará a: `mongodb://localhost:27017/travel_platform_db_local`

4. **Poblar la base de datos** (opcional)

   ```bash
   cd Backend
   npm run seed
   ```

5. **Iniciar el Backend**

   ```bash
   cd Backend
   npm run dev
   # Servidor en http://localhost:3002
   ```

6. **Iniciar el Frontend** (en otra terminal)
   ```bash
   cd "Frontend/Plataforma Interactiva de Viajes con Registro y Login"
   npm run dev
   # Aplicación en http://localhost:5174
   ```

## 🌐 URLs de la Aplicación

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3002
- **Health Check**: http://localhost:3002/api/health

## 📚 API Endpoints

### Autenticación

- `POST /api/users/register` - Registro de usuarios
- `POST /api/users/login` - Login de usuarios
- `GET /api/users/profile` - Perfil del usuario autenticado

### Posts

- `GET /api/posts` - Obtener todos los posts
- `POST /api/posts` - Crear nuevo post (requiere auth)
- `GET /api/posts/:id` - Obtener post específico
- `PUT /api/posts/:id` - Actualizar post (requiere auth + ownership)
- `DELETE /api/posts/:id` - Eliminar post (requiere auth + ownership)
- `POST /api/posts/:id/like` - Like/unlike post (requiere auth)

### Comentarios

- `GET /api/comments/post/:postId` - Obtener comentarios de un post
- `POST /api/comments/post/:postId` - Crear comentario en un post (requiere auth)
- `PUT /api/comments/:commentId` - Actualizar comentario (requiere auth + ownership)
- `DELETE /api/comments/:commentId` - Eliminar comentario (requiere auth + ownership)

## 🔐 Datos de Prueba

Si ejecutaste el script de seed, tendrás estos usuarios de prueba:

| Email              | Contraseña | Nombre       |
| ------------------ | ---------- | ------------ |
| juan@example.com   | 123456     | Juan Pérez   |
| maria@example.com  | 123456     | María García |
| carlos@example.com | 123456     | Carlos López |

## 🗂️ Estructura del Proyecto

```
📁 Backend/
├── 📁 config/         # Configuración de base de datos
├── 📁 controllers/    # Controladores de API
├── 📁 middlewares/    # Middlewares de autenticación y validación
├── 📁 models/         # Modelos de MongoDB (User, Post, Comment)
├── 📁 routes/         # Rutas de API
├── 📁 scripts/        # Scripts de utilidad (seed, etc.)
├── 📁 settings/       # Variables de entorno
├── 📁 validations/    # Validaciones de entrada
└── 📄 app.js          # Archivo principal del servidor

📁 Frontend/
└── 📁 Plataforma Interactiva de Viajes con Registro y Login/
    ├── 📁 src/
    │   ├── 📁 components/  # Componentes React
    │   ├── 📁 contexts/    # Context API (AuthContext)
    │   ├── 📄 App.jsx      # Componente principal
    │   └── 📄 main.jsx     # Punto de entrada
    ├── 📄 index.html
    └── 📄 package.json
```

## 🐛 Resolución de Problemas

### MongoDB no se conecta

1. Verifica que MongoDB esté ejecutándose
2. Abre MongoDB Compass y conecta a `mongodb://localhost:27017`
3. Si usas MongoDB como servicio, inicia el servicio

### Puerto en uso

- Backend usa puerto **3002** por defecto
- Frontend usa puerto **5174** por defecto
- Si hay conflictos, los puertos se cambiarán automáticamente

### Errores de CORS

El backend está configurado para aceptar requests desde:

- `http://localhost:5173`
- `http://localhost:5174`

## 🤝 Funcionalidades Implementadas

- ✅ Sistema completo de autenticación JWT
- ✅ CRUD completo para posts con ownership
- ✅ Sistema de comentarios con relaciones
- ✅ Sistema de likes/unlikes
- ✅ Validaciones de entrada en backend
- ✅ UI responsive con Bootstrap 5
- ✅ Gestión de estado con Context API
- ✅ Middleware de autenticación y autorización
- ✅ Seed de datos de prueba
- ✅ Scripts de automatización
- ✅ Manejo de errores y loading states

## 🎯 Próximos Pasos

- [ ] Upload de imágenes a servidor
- [ ] Búsqueda y filtros avanzados
- [ ] Notificaciones en tiempo real
- [ ] Perfil de usuario avanzado
- [ ] Integración con mapas
- [ ] Tema oscuro/claro

## 📄 Licencia

Este proyecto es para propósitos educativos - Argentina Programa 2025.

---

**Desarrollado por: Claudio Rohr**  
**¡Disfruta explorando y compartiendo tus experiencias de viaje! ✈️🌍**
