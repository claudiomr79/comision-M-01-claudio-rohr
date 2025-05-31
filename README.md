# Plataforma Interactiva de Viajes (Proyecto Integrador Tramo III - Argentina Programa)

## Descripción General

Plataforma web interactiva diseñada para compartir y descubrir experiencias de viajes. Permite a los usuarios registrarse, iniciar sesión, crear publicaciones (posts) sobre sus viajes detallando título, descripción e imágenes, visualizar las publicaciones de otros usuarios y participar añadiendo comentarios.

**Funcionalidades Principales:**
*   **Autenticación de Usuarios:** Sistema completo de registro e inicio de sesión utilizando JSON Web Tokens (JWT) para la gestión de sesiones seguras.
*   **Gestión de Posts (CRUD):** Funcionalidad completa para Crear, Leer, Actualizar y Eliminar (CRUD) posts.
    *   **Autorización:** Los usuarios tienen control exclusivo para editar y eliminar únicamente sus propias publicaciones.
*   **Sistema de Comentarios:** Los usuarios pueden comentar en los posts, y cada comentario muestra el nombre del autor, fomentando la interacción.
*   **Interfaz de Usuario:** Diseñada para ser intuitiva (aunque el enfoque principal del proyecto ha sido la funcionalidad backend y la integración frontend, se asume una base responsive).

## Arquitectura del Proyecto

*   **Frontend:** Desarrollado con React (utilizando Vite como herramienta de construcción), React Router para la navegación, JavaScript (ES6+), y CSS para estilos.
*   **Backend:** Construido sobre Node.js y el framework Express.js para la creación de la API REST.
*   **Base de Datos:** MongoDB, con Mongoose como ODM (Object Data Modeling) para la interacción con la base de datos.
*   **Despliegue:** Dockerizado y orquestado mediante Docker Compose, permitiendo un entorno de desarrollo y despliegue consistente.

## Prerrequisitos

### Para Desarrollo Local:
*   **Node.js:** Se recomienda la versión 18.x o superior.
*   **npm:** Generalmente se incluye con la instalación de Node.js.
*   **MongoDB:** Es necesario tener una instancia de MongoDB instalada localmente y el servicio corriendo, accesible en el puerto por defecto `27017`.

### Para Despliegue con Docker:
*   **Docker:** Docker Desktop (para Windows/Mac) o Docker Engine (para Linux).
*   **Docker Compose:** Herramienta para definir y ejecutar aplicaciones Docker multi-contenedor (generalmente incluida con Docker Desktop).

## Configuración y Ejecución en Entorno Local

Sigue estos pasos para configurar y ejecutar la aplicación en tu máquina local.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Rohrclaudiog/comision-M-01-claudio-rohr.git # Reemplaza con la URL real si es diferente
cd comision-M-01-claudio-rohr
```

### 2. Configuración del Backend
```bash
cd Backend
npm install
```
Crea un archivo `.env` en el directorio `Backend/` con el siguiente contenido (ajusta los valores según sea necesario):
```env
# Backend/.env
PORT=4000
MONGO_URI=mongodb://localhost:27017/travel_platform_db_local # O tu URI de MongoDB local
JWT_SECRET=tu_jwt_secret_para_desarrollo_local_backend_muy_seguro
```

### 3. Configuración del Frontend
```bash
cd ../Frontend/Plataforma Interactiva de Viajes con Registro y Login
npm install
```
**Nota sobre el Frontend `.env`:**
No es estrictamente necesario crear un archivo `.env` en el directorio del frontend para la URL base de la API si se utiliza el proxy de Vite. La configuración actual en `vite.config.js` (`server.proxy`) está diseñada para redirigir las solicitudes de `/api` al backend (ej., `http://localhost:4000`) durante el desarrollo. Los servicios del frontend (como `authService.js`, `postService.js`) utilizan rutas relativas (ej., `/api/users/login`), que funcionarán con esta configuración de proxy.

Si necesitaras anular esto o usar una URL base explícita, podrías crear un archivo `Frontend/Plataforma Interactiva de Viajes con Registro y Login/.env` con:
```env
# Frontend/Plataforma Interactiva de Viajes con Registro y Login/.env (opcional)
# VITE_API_BASE_URL=http://localhost:4000
```
Y luego modificar los servicios para usar `import.meta.env.VITE_API_BASE_URL + '/api/...'`. Por ahora, se recomienda usar el proxy.

### 4. Ejecutar la Aplicación Localmente
*   **Iniciar Backend:** Abre una terminal, navega a `Backend/` y ejecuta:
    ```bash
    npm start
    ```
    (Este comando ejecuta `nodemon app.js` según `Backend/package.json`).
    El backend debería estar corriendo en `http://localhost:4000` (o el puerto que hayas configurado).

*   **Iniciar Frontend:** Abre otra terminal, navega a `Frontend/Plataforma Interactiva de Viajes con Registro y Login/` y ejecuta:
    ```bash
    npm run dev
    ```
    El frontend debería estar accesible en `http://localhost:5173` (o el puerto que Vite asigne).

## Despliegue con Docker y Docker Compose

Esta es la forma recomendada para ejecutar la aplicación, facilitando un entorno consistente.

### 1. Clonar el Repositorio (si aún no lo has hecho)
```bash
git clone https://github.com/Rohrclaudiog/comision-M-01-claudio-rohr.git # Reemplaza con la URL real si es diferente
cd comision-M-01-claudio-rohr
```

### 2. Configurar Variables de Entorno para Docker Compose
Crea un archivo `.env` en el **directorio raíz** del proyecto (al mismo nivel que `docker-compose.yml`) con el siguiente contenido:
```env
# .env (raíz del proyecto)
JWT_SECRET=tu_super_secreto_jwt_aqui_para_docker_compose_debe_ser_fuerte_y_diferente_al_local
BACKEND_PORT_HOST=4000
BACKEND_PORT_CONTAINER=4000 # Debe coincidir con PORT en Backend/settings/envs.js y el Dockerfile del backend
FRONTEND_PORT_HOST=3000

# MONGO_URI no es necesaria aquí; se define dentro de docker-compose.yml
# para que el servicio backend apunte al servicio 'mongo'.
# La base de datos para Docker se llamará 'travel_platform_db_docker' (ver docker-compose.yml).
```
**¡Importante!** El `JWT_SECRET` debe ser una cadena larga, compleja y única, especialmente si se planea un despliegue a producción. No subas este archivo `.env` a un repositorio público si contiene secretos de producción.

### 3. Levantar la Aplicación con Docker Compose
Desde el directorio raíz del proyecto (donde se encuentra `docker-compose.yml`), ejecuta el siguiente comando en tu terminal:
```bash
docker-compose up --build
```
La opción `--build` fuerza la reconstrucción de las imágenes si ha habido cambios en los Dockerfiles o en el código fuente relevante. Para ejecuciones subsecuentes, `docker-compose up` puede ser suficiente si las imágenes ya están construidas.

### 4. Acceder a la Aplicación
Una vez que los contenedores estén en ejecución:
*   **Frontend:** Abre tu navegador y ve a `http://localhost:3000` (o el `FRONTEND_PORT_HOST` que hayas configurado).
*   **Backend API:** Estará accesible en `http://localhost:4000` (o el `BACKEND_PORT_HOST`), con los endpoints bajo `/api` (ej., `http://localhost:4000/api/posts`).
*   **MongoDB:** El servicio de base de datos MongoDB estará escuchando en el puerto `27017` de tu máquina host, pero los servicios dentro de la red Docker se comunicarán con él usando el nombre de servicio `mongo` y el puerto interno `27017`.

### 5. Detener la Aplicación
*   Para detener los contenedores, presiona `Ctrl+C` en la terminal donde `docker-compose up` se está ejecutando.
*   Para detener y eliminar los contenedores (esto no elimina los volúmenes por defecto):
    ```bash
    docker-compose down
    ```
*   Para detener, eliminar los contenedores Y los volúmenes nombrados (¡cuidado, esto borrará los datos de la base de datos `mongo-data`!):
    ```bash
    docker-compose down -v
    ```

## Estructura del Proyecto (Referencia)
```
.
├── Backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── settings/
│   ├── validations/
│   ├── .dockerignore
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── ... (otros archivos como .env de ejemplo, etc.)
├── Frontend/
│   └── Plataforma Interactiva de Viajes con Registro y Login/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── services/
│       │   ├── utils/
│       │   ├── App.jsx
│       │   ├── main.jsx
│       │   └── ...
│       ├── .dockerignore
│       ├── Dockerfile
│       ├── index.html
│       ├── package.json
│       ├── vite.config.js # Importante para el proxy en desarrollo local
│       └── ...
├── .env            # Para Docker Compose (NO SUBIR CON SECRETOS REALES)
├── docker-compose.yml
└── README.md
```

## Contribuciones
Las contribuciones y sugerencias son bienvenidas. Para cambios mayores, por favor, abre un *issue* primero para discutir lo que te gustaría cambiar. Si deseas contribuir directamente, puedes hacer un *fork* del repositorio y enviar un *pull request*.

---
*Proyecto desarrollado como parte de Argentina Programa - Tramo III.*
*Autor: Claudio Rohr (con asistencia de IA para desarrollo y documentación).*
