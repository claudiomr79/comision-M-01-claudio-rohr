# Dockerfile para el Frontend (React con Vite) de la Plataforma Interactiva de Viajes

# --- Etapa de Compilación (Builder) ---
# Se utiliza una imagen de Node.js para compilar los archivos estáticos del frontend.
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo para la etapa de compilación.
WORKDIR /usr/src/app/frontend

# Copiar package.json y package-lock.json.
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies necesarias para el build).
RUN npm install

# Copiar el resto del código fuente del frontend.
COPY . .

# Ejecutar el script de compilación (usualmente 'npm run build' para Vite/React).
# Esto generará los archivos estáticos en el directorio 'dist' (o el configurado en vite.config.js).
RUN npm run build

# --- Etapa de Producción (Servidor Web) ---
# Se utiliza una imagen ligera de Nginx para servir los archivos estáticos compilados.
FROM nginx:stable-alpine

# Eliminar la configuración por defecto de Nginx del directorio de bienvenida.
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos estáticos compilados desde la etapa 'builder' al directorio raíz de Nginx.
# Asegúrate de que la ruta de origen '/usr/src/app/frontend/dist' coincida con la salida de tu build.
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html

# (Opcional pero Recomendado para Single Page Applications - SPAs)
# Si tu aplicación React utiliza react-router-dom u otro enrutador del lado del cliente,
# necesitarás configurar Nginx para que redirija todas las solicitudes a index.html
# para que el enrutamiento de React funcione correctamente.
# Esto se hace usualmente creando un archivo de configuración de Nginx personalizado.
# Ejemplo: nginx.conf
# COPY nginx.conf /etc/nginx/conf.d/default.conf
#
# Contenido de un posible nginx.conf básico para SPAs:
# server {
#   listen 80;
#   server_name localhost;
#
#   root /usr/share/nginx/html;
#   index index.html index.htm;
#
#   location / {
#     try_files $uri $uri/ /index.html;
#   }
#
#   # (Opcional) Proxy para el backend si Nginx también actúa como reverse proxy.
#   # location /api {
#   #   proxy_pass http://backend_service_name:backend_port; # ej. http://backend:4000
#   #   proxy_set_header Host $host;
#   #   proxy_set_header X-Real-IP $remote_addr;
#   #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#   #   proxy_set_header X-Forwarded-Proto $scheme;
#   # }
# }
# Por ahora, se usará la configuración por defecto de Nginx y se asumirá que el enrutamiento
# y el proxy (si es necesario) se manejan de otra manera o se añadirán después.

# Exponer el puerto 80, que es el puerto por defecto de Nginx.
EXPOSE 80

# El comando por defecto de la imagen de Nginx ya se encarga de iniciar el servidor.
# CMD ["nginx", "-g", "daemon off;"] está implícito.

# Comentarios Adicionales:
# - Variables de Entorno para el Frontend: Si tu app Vite necesita variables de entorno en tiempo de ejecución
#   (accesibles a través de import.meta.env), estas deben ser configuradas en el entorno donde se sirve Nginx
#   o inyectadas en los archivos HTML/JS de una manera diferente, ya que Nginx no las pasa por defecto
#   a los archivos estáticos. Una técnica común es tener un script de entrada en el Dockerfile de Nginx
#   que reemplace placeholders en los archivos JS antes de iniciar Nginx.
#   Para variables de entorno en tiempo de *compilación* (ej. VITE_API_BASE_URL), estas se configuran
#   en el entorno donde se ejecuta `npm run build` (etapa 'builder'). El docker-compose.yml puede
#   pasar 'build arguments' (ARG) a esta etapa si es necesario.
